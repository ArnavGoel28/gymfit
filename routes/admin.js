import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';

const router = express.Router();

// Admin authorization middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
};

// Get all attendance for today or specific date
router.get('/attendance', auth, adminOnly, async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const Attendance = mongoose.model('Attendance');
        const attendance = await Attendance.find({ date }).populate('userId', 'name email');
        res.json(attendance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all bookings
router.get('/bookings', auth, adminOnly, async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const Booking = mongoose.model('Booking');
        const bookings = await Booking.find({ date }).populate('userId', 'name email').sort({ slotTime: 1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Cancel any user's booking by admin
router.delete('/booking/:id', auth, adminOnly, async (req, res) => {
    try {
        const Booking = mongoose.model('Booking');
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Booking deleted by Admin' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Dashboard Analytics
router.get('/analytics', auth, adminOnly, async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Total daily attendance today
        const Attendance = mongoose.model('Attendance');
        const totalAttendanceToday = await Attendance.countDocuments({ date: todayStr });
        
        // Members count
        const User = mongoose.model('User');
        const totalMembers = await User.countDocuments({ role: 'user' });
        
        // Most busy slot today
        const Booking = mongoose.model('Booking');
        const slotAgg = await Booking.aggregate([
            { $match: { date: todayStr, status: 'booked' } },
            { $group: { _id: "$slotTime", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        
        let mostBusySlot = slotAgg.length > 0 ? slotAgg[0]._id : "None yet";
        
        res.json({
            todayAttendance: totalAttendanceToday,
            members: totalMembers,
            mostBusySlot: mostBusySlot
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
