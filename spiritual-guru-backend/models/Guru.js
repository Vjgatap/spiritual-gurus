const mongoose = require('mongoose');

const guruSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    era: {
      type: mongoose.Schema.Types.ObjectId, // References the Category model
      required: true,
      ref: 'Category', // This explicitly links the guru to a Category document
    },
    bio: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true, // URL for the guru's image
    },
    youtubeVideoUrl: {
      type: String,
      required: true, // URL for a YouTube video related to the guru
    },
    books: [ // Array of objects for books written/related to the guru
      {
        title: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Guru = mongoose.model('Guru', guruSchema);

module.exports = Guru;
