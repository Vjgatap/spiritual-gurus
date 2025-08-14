const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware'); // Import the authentication and authorization middleware

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private/Admin - Only authenticated admins can create categories
router.post('/', protect, admin, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400); // Bad request if essential fields are missing
    throw new Error('Please enter all fields for the category.');
  }

  try {
    // Check if a category with the same name already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category with this name already exists.');
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category); // 201 Created on success
  } catch (error) {
    res.status(400).json({ message: error.message }); // Send specific error message
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category by ID
// @access  Private/Admin - Only authenticated admins can update categories
router.put('/:id', protect, admin, async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404); // Not Found if category doesn't exist
      throw new Error('Category not found.');
    }

    // Check if a category with the new name already exists AND is not the current category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory && existingCategory._id.toString() !== category._id.toString()) {
        res.status(400);
        throw new Error('Category with this name already exists.');
      }
    }

    // Update fields if provided, otherwise retain old value
    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save(); // Save the updated category
    res.json(updatedCategory); // Send the updated category
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category by ID
// @access  Private/Admin - Only authenticated admins can delete categories
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404); // Not Found if category doesn't exist
      throw new Error('Category not found.');
    }

    await category.deleteOne(); // Use deleteOne() on the Mongoose document
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message }); // General server error for deletion issues
  }
});

module.exports = router;
