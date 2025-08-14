    const express = require('express');
    const dotenv = require('dotenv');
    const connectDB = require('./config/db');
    const userRoutes = require('./routes/userRoutes');
    const categoryRoutes = require('./routes/categoryRoutes');
    const guruRoutes = require('./routes/guruRoutes');
    const cors = require('cors');

    // Load environment variables
    dotenv.config();

    // Connect to the database
    connectDB();

    const app = express();

    // IMPORTANT: Middleware to parse JSON bodies MUST come before routes
    app.use(express.json());

    // Enable CORS for all routes (also important to be early)
    app.use(cors());

    // A simple route to test the server
    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    // Use the routes
    app.use('/api/users', userRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/gurus', guruRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    