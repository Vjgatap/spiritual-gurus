const express = require('express');
const router = express.Router();
const Guru = require('../models/Guru');
const { protect, admin } = require('../middleware/authMiddleware'); // Import middleware

// @route   GET /api/gurus
// @desc    Get all gurus, with optional filtering by era ID
// @access  Public
router.get('/', async (req, res) => {
  const { era } = req.query; // Expects the era's ObjectId as a query parameter
  const filter = era ? { era: era } : {}; // If era is provided, filter by it

  try {
    // Find gurus and populate the 'era' field to get the category's 'name'
    const gurus = await Guru.find(filter).populate('era', 'name');
    res.json(gurus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/gurus/:id
// @desc    Get a single guru by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Find guru by ID and populate the 'era' field
    const guru = await Guru.findById(req.params.id).populate('era', 'name');
    if (guru) {
      res.json(guru);
    } else {
      res.status(404).json({ message: 'Guru not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gurus
// @desc    Create a new guru
// @access  Private/Admin - Only authenticated admins can create gurus
router.post('/', protect, admin, async (req, res) => {
  const { name, era, bio, imageUrl, youtubeVideoUrl, books } = req.body;

  // Validate required fields
  if (!name || !era || !bio || !imageUrl || !youtubeVideoUrl) {
    res.status(400);
    throw new Error('Please enter all required fields for the guru.');
  }

  try {
    const guru = await Guru.create({
      name,
      era, // This should be a valid Category ObjectId
      bio,
      imageUrl,
      youtubeVideoUrl,
      books: books || [], // Ensure 'books' is an array, default to empty if not provided
    });
    res.status(201).json(guru); // 201 Created on success
  } catch (error) {
    res.status(400).json({ message: error.message }); // Send specific error message
  }
});

// @route   PUT /api/gurus/:id
// @desc    Update a guru by ID
// @access  Private/Admin - Only authenticated admins can update gurus
router.put('/:id', protect, admin, async (req, res) => {
  const { name, era, bio, imageUrl, youtubeVideoUrl, books } = req.body;

  try {
    const guru = await Guru.findById(req.params.id);

    if (!guru) {
      res.status(404); // Not Found if guru doesn't exist
      throw new Error('Guru not found.');
    }

    // Update fields if provided in the request body
    guru.name = name || guru.name;
    guru.era = era || guru.era; // This should be a valid Category ObjectId
    guru.bio = bio || guru.bio;
    guru.imageUrl = imageUrl || guru.imageUrl;
    guru.youtubeVideoUrl = youtubeVideoUrl || guru.youtubeVideoUrl;
    guru.books = books !== undefined ? books : guru.books; // Allows setting books to empty array

    const updatedGuru = await guru.save(); // Save the updated guru document
    res.json(updatedGuru); // Send the updated guru
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/gurus/:id
// @desc    Delete a guru by ID
// @access  Private/Admin - Only authenticated admins can delete gurus
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);

    if (!guru) {
      res.status(404); // Not Found if guru doesn't exist
      throw new Error('Guru not found.');
    }

    await guru.deleteOne(); // Use deleteOne() on the Mongoose document
    res.json({ message: 'Guru removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
