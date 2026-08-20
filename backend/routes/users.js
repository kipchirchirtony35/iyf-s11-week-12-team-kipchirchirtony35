const express = require('express');
const { User } = require('../db');
const { authenticate, requireRole } = require('../auth');

const router = express.Router();

// Admin-only: list users
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
    
    // Map _id to id to match frontend expectations if necessary
    const formattedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.createdAt || u._id.getTimestamp()
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Admin: get single user
router.get('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'name email role createdAt');
    if (!user) return res.status(404).json({ error: 'Not found' });

    const formattedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt || user._id.getTimestamp()
    };

    res.json(formattedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching user' });
  }
});

module.exports = router;