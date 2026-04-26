const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// Mark attendance - requires auth
router.post('/mark', auth, async (req, res) => {
    try {
        const { userId, date } = req.body; // Expecting date in YYYY-MM-DD
        
        // Prevent duplicate entries
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

module.exports = router;
