const mongoose = require('mongoose');

const guruSchema = mongoose.Schema(
  {
    fullName: { // Renamed from 'name' to 'fullName' to match request
      type: String,
      required: true,
    },
    dob: { // Date of Birth
      type: Date,
      required: true,
    },
    dod: { // Date of Death
      type: Date,
      required: false, // Optional, for living gurus
    },
    birthPlace: {
      type: String,
      required: true,
    },
    // Age can be derived on frontend or in backend. Storing it directly might lead to stale data.
    // Let's derive it or display DOB/DOD. If you specifically need a stored 'age', let me know.
    
    guruType: { // E.g., nastik, bhaktiyog, karmyogi
      type: String,
      required: true,
      enum: ['Nastik', 'Bhaktiyog', 'Karmyogi', 'Jnanayog', 'Rajayog', 'Other'], // Example enum values
      default: 'Other',
    },
    aashram: { // Guru's primary aashram/organization
      type: String,
      required: false,
    },
    era: { // Category remains the same
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    bio: { // Biography remains
      type: String,
      required: true,
    },
    profileImageUrl: { // New: For circular profile image
      type: String,
      required: true,
    },
    bgImageUrl: { // New: For background long image (like LinkedIn)
      type: String,
      required: false, // Optional background image
    },
    images: [ // Array of image URLs for gallery (100+ images)
      {
        url: { type: String, required: true },
        caption: { type: String, required: false } // Optional: caption for each image
      }
    ],
    videos: [ // Array of video URLs (YouTube)
      {
        url: { type: String, required: true },
        title: { type: String, required: false } // Optional: title for each video
      }
    ],
    books: [ // Array of book objects, now including PDF URL
      {
        title: { type: String, required: true },
        pdfUrl: { type: String, required: false }, // URL to PDF, optional
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Guru = mongoose.model('Guru', guruSchema);

module.exports = Guru;
