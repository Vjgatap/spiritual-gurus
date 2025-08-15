const express = require('express');
const router = express.Router();
const Guru = require('../models/Guru');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/gurus
// @desc    Get all gurus, with optional filtering by era
// @access  Public
router.get('/', async (req, res) => {
  const { era } = req.query;
  const filter = era ? { era: era } : {};

  try {
    // Populate era and select all guru fields except individual image/video/book details
    // For a list, you might not want all 100+ images/videos to reduce payload size.
    // We'll primarily rely on the detail page to fetch all of them.
    const gurus = await Guru.find(filter)
      .populate('era', 'name')
      .select('fullName dob dod birthPlace guruType aashram era bio profileImageUrl bgImageUrl'); // Select specific fields for list view
    res.json(gurus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/gurus/:id
// @desc    Get a single guru by ID - Now fetches ALL details including images/videos/books
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id)
                            .populate('era', 'name'); // Populate era name
    if (guru) {
      res.json(guru); // Send back the full guru object with all details
    } else {
      res.status(404).json({ message: 'Guru not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gurus
// @desc    Create a new guru with all new fields
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const {
    fullName,
    dob,
    dod,
    birthPlace,
    guruType,
    aashram,
    era,
    bio,
    profileImageUrl,
    bgImageUrl,
    images, // Array of { url, caption }
    videos, // Array of { url, title }
    books, // Array of { title, pdfUrl }
  } = req.body;

  // Basic validation for required fields
  if (!fullName || !dob || !birthPlace || !guruType || !era || !bio || !profileImageUrl) {
    res.status(400);
    throw new Error('Please enter all required fields for the guru: Full Name, DOB, Birth Place, Guru Type, Era, Bio, Profile Image URL.');
  }

  try {
    const guru = await Guru.create({
      fullName,
      dob: new Date(dob), // Convert string to Date object
      dod: dod ? new Date(dod) : undefined, // Convert if provided
      birthPlace,
      guruType,
      aashram,
      era,
      bio,
      profileImageUrl,
      bgImageUrl,
      images: images || [],
      videos: videos || [],
      books: books || [],
    });
    res.status(201).json(guru);
  } catch (error) {
    console.error('Guru creation error:', error); // Log full error for debugging
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/gurus/:id
// @desc    Update a guru by ID with all new fields
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const {
    fullName,
    dob,
    dod,
    birthPlace,
    guruType,
    aashram,
    era,
    bio,
    profileImageUrl,
    bgImageUrl,
    images,
    videos,
    books,
  } = req.body;

  try {
    const guru = await Guru.findById(req.params.id);

    if (!guru) {
      res.status(404);
      throw new Error('Guru not found.');
    }

    // Update fields if provided, otherwise retain old value
    guru.fullName = fullName !== undefined ? fullName : guru.fullName;
    guru.dob = dob ? new Date(dob) : guru.dob;
    guru.dod = dod !== undefined ? (dod ? new Date(dod) : undefined) : guru.dod; // Handle explicit null/empty for DOD
    guru.birthPlace = birthPlace !== undefined ? birthPlace : guru.birthPlace;
    guru.guruType = guruType !== undefined ? guruType : guru.guruType;
    guru.aashram = aashram !== undefined ? aashram : guru.aashram;
    guru.era = era !== undefined ? era : guru.era;
    guru.bio = bio !== undefined ? bio : guru.bio;
    guru.profileImageUrl = profileImageUrl !== undefined ? profileImageUrl : guru.profileImageUrl;
    guru.bgImageUrl = bgImageUrl !== undefined ? bgImageUrl : guru.bgImageUrl;

    // For arrays, allow replacement if provided, otherwise keep existing
    guru.images = images !== undefined ? images : guru.images;
    guru.videos = videos !== undefined ? videos : guru.videos;
    guru.books = books !== undefined ? books : guru.books;

    const updatedGuru = await guru.save();
    res.json(updatedGuru);
  } catch (error) {
    console.error('Guru update error:', error); // Log full error for debugging
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/gurus/:id
// @desc    Delete a guru by ID
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);

    if (!guru) {
      res.status(404);
      throw new Error('Guru not found.');
    }

    await guru.deleteOne();
    res.json({ message: 'Guru removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
