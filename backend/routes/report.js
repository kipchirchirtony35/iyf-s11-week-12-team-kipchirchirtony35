const express = require('express');
const { Loan, Book, User } = require('../db');
const { authenticate, requireRole } = require('../auth');

const router = express.Router();

// GET /api/reports/overdue
router.get('/overdue', authenticate, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const now = new Date().toISOString();
    const overdueLoans = await Loan.find({
      status: 'active',
      due_at: { $lt: now }
    })
      .populate('user_id', 'name')
      .populate('book_id', 'title')
      .sort({ due_at: 1 });

    const formattedRows = overdueLoans.map(l => ({
      ...l.toObject(),
      user_name: l.user_id ? l.user_id.name : null,
      book_title: l.book_id ? l.book_id.title : null
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating overdue report' });
  }
});

// GET /api/reports/popular-books
router.get('/popular-books', authenticate, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const popularBooks = await Loan.aggregate([
      {
        $group: {
          _id: '$book_id',
          times_borrowed: { $sum: 1 }
        }
      },
      { $sort: { times_borrowed: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookInfo'
        }
      },
      { $unwind: '$bookInfo' },
      {
        $project: {
          _id: 0,
          id: '$bookInfo._id',
          title: '$bookInfo.title',
          author: '$bookInfo.author',
          times_borrowed: 1
        }
      }
    ]);

    res.json(popularBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating popular books report' });
  }
});

module.exports = router;