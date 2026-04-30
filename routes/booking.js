import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';

const router = express.Router();

// Book a slot - requires auth
router.post('/create', auth, async (req, res) => {
    try {
        const { userId, slotTime, date } = req.body;

        // Check capacity limit (max 20 members per slot)
        const Booking = mongoose.model('Booking');
        const count = await Booking.countDocuments({ slotTime, date, status: 'booked' });
        if (count >= 20) {
            return res.status(400).json({ msg: 'Slot Full. Max capacity reached.' });
        }

        // Prevent double booking for the same user on the same date for the same slot
        let existingBooking = await Booking.findOne({ userId, date, slotTime, status: 'booked' });
        if (existingBooking) {
            return res.status(400).json({ msg: 'You have already booked this slot' });
        }

        const booking = new Booking({ userId, slotTime, date });
        await booking.save();

        res.json({ msg: 'Slot booked successfully', booking });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user bookings
router.get('/mybookings/:userId', auth, async (req, res) => {
    try {
        const Booking = mongoose.model('Booking');
        const bookings = await Booking.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Cancel a booking
router.put('/cancel/:id', auth, async (req, res) => {
    try {
        const Booking = mongoose.model('Booking');
        let booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        booking.status = 'cancelled';
        await booking.save();
        res.json({ msg: 'Booking cancelled' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get daily slot availability
router.get('/availability/:date', auth, async (req, res) => {
    try {
        const Booking = mongoose.model('Booking');
        const date = req.params.date;
        const slots = await Booking.aggregate([
            { $match: { date: date, status: 'booked' } },
            { $group: { _id: "$slotTime", count: { $sum: 1 } } }
        ]);
        res.json(slots);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;

