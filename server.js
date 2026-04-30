import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { auth, admin } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models to register them
import './models/User.js';
import './models/Attendance.js';
import './models/Booking.js';

import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import bookingRoutes from './routes/booking.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Setup Routes
app.use('/api/auth', authRoutes);
// Protected routes
app.use('/api/attendance', auth, attendanceRoutes);
app.use('/api/booking', auth, bookingRoutes);
app.use('/api/admin', auth, admin, adminRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gymBD';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start server if run directly
if (process.argv[1] === __filename) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export for Vercel
export default app;
