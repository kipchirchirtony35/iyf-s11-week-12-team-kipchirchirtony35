const express = require('express');
const { body, validationResult } = require('express-validator');
const { Book } = require('../db');
const { authenticate, requireRole } = require('../auth');

const router = express.Router();

// GET /api/books?query=&curriculum_level=&grade=&category=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { query, curriculum_level, grade, category, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      filter.$or = [
        { title: regex },
        { author: regex },
        { isbn: regex },
        { description: regex }
      ];
    }
    if (curriculum_level) filter.curriculum_level = curriculum_level;
    if (grade) filter.grade = grade;
    if (category) filter.category = category;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(filter)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limitNum);

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching books' });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching book' });
  }
});

// Admin: create book
router.post('/',
  authenticate,
  requireRole('admin', 'librarian'),
  body('title').isLength({ min: 1 }),
  body('author').isLength({ min: 1 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { title, author, isbn, category, curriculum_level, grade, copies_total = 1, description } = req.body;
      const copies = Number(copies_total) || 1;

      const newBook = await Book.create({
        title,
        author,
        isbn: isbn || null,
        category: category || null,
        curriculum_level: curriculum_level || null,
        grade: grade || null,
        copies_total: copies,
        copies_available: copies,
        description: description || null
      });

      res.status(201).json(newBook);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error creating book' });
    }
  }
);

// Admin: update
router.put('/:id',
  authenticate,
  requireRole('admin', 'librarian'),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Not found' });

      const updates = { ...req.body };

      // if copies_total changed, adjust copies_available accordingly
      if (updates.copies_total !== undefined) {
        const diff = Number(updates.copies_total) - book.copies_total;
        updates.copies_available = (book.copies_available || 0) + diff;
        if (updates.copies_available < 0) updates.copies_available = 0;
      }

      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true } // Returns the updated document
      );

      res.json(updatedBook);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error updating book' });
    }
  }
);

// Admin: delete
router.delete('/:id',
  authenticate,
  requireRole('admin', 'librarian'),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Not found' });

      await Book.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error deleting book' });
    }
  }
);

module.exports = router;