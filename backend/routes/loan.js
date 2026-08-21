const express = require('express');
const { Loan, Book, User } = require('../db');
const { authenticate, requireRole } = require('../auth');

const router = express.Router();

// POST /api/loans  { bookId, dueDays? }
router.post('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { bookId, dueDays = 14 } = req.body;
    if (!bookId) return res.status(400).json({ error: 'bookId required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.copies_available <= 0) return res.status(409).json({ error: 'No copies available' });

    const now = new Date();
    const borrowed_at = now.toISOString();
    const due_at = new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000).toISOString();

    const loan = await Loan.create({
      book_id: bookId,
      user_id: user.id || user._id,
      borrowed_at,
      due_at,
      status: 'active'
    });

    // decrement copies_available
    book.copies_available -= 1;
    await book.save();

    const populatedLoan = await Loan.findById(loan._id).populate('book_id', 'title');
    res.status(201).json(populatedLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating loan' });
  }
});

// PUT /api/loans/:id/return
router.put('/:id/return', authenticate, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status === 'returned') return res.status(400).json({ error: 'Already returned' });

    // Only admin/librarian or loan owner can return
    const userId = req.user.id || req.user._id;
    const isOwner = userId === loan.user_id.toString();
    if (!isOwner && !['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    loan.returned_at = new Date().toISOString();
    loan.status = 'returned';
    await loan.save();

    // increment copies_available
    const book = await Book.findById(loan.book_id);
    if (book) {
      book.copies_available += 1;
      await book.save();
    }

    const updated = await Loan.findById(req.params.id).populate('book_id', 'title');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error returning loan' });
  }
});

// GET /api/loans?status=active|overdue|returned
router.get('/', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    let sort = { borrowed_at: -1 };

    if (status === 'overdue') {
      query.status = 'active';
      query.due_at = { $lt: new Date().toISOString() };
      sort = { due_at: 1 };
    } else if (status === 'returned') {
      query.status = 'returned';
      sort = { returned_at: -1 };
    } else {
      query.status = 'active';
    }

    const loans = await Loan.find(query)
      .populate('book_id', 'title')
      .populate('user_id', 'name')
      .sort(sort);

    // Map output to match frontend expectations if necessary (e.g., matching SQL alias properties)
    const formattedRows = loans.map(l => ({
      ...l.toObject(),
      title: l.book_id ? l.book_id.title : null,
      user_name: l.user_id ? l.user_id.name : null
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching loans' });
  }
});

// GET /api/users/:id/loans (user's loans) - note route is mounted as /api/loans/user/:id based on your server setup
router.get('/user/:id', authenticate, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id || req.user._id;

    // only admin/librarian or the user themself
    if (currentUserId !== targetUserId && !['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const loans = await Loan.find({ user_id: targetUserId })
      .populate('book_id', 'title')
      .sort({ createdAt: -1 });

    const formattedRows = loans.map(l => ({
      ...l.toObject(),
      title: l.book_id ? l.book_id.title : null
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching user loans' });
  }
});

module.exports = router;