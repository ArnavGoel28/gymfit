const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD, unique per user enforced at DB level
    checkInTime: { type: Date, default: Date.now }
});

// Index for fast lookup by date and user
attendanceSchema.index({ date: 1, userId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
