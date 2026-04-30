import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Mark attendance - requires auth
router.post('/mark', auth, async (req, res) => {
    try {
        const { userId, date } = req.body; // Expecting date in YYYY-MM-DD

        // Prevent duplicate entries
        const Attendance = mongoose.model('Attendance');
        let attendance = await Attendance.findOne({ userId, date });
        if (attendance) {
            return res.status(400).json({ msg: 'Attendance already marked for today' });
        }

        attendance = new Attendance({ userId, date });
        await attendance.save();

        res.json({ msg: 'Attendance marked successfully', attendance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
