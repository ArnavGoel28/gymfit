const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotTime: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
});

// Indexes for better query performance
bookingSchema.index({ date: 1, slotTime: 1 });
bookingSchema.index({ userId: 1, date: 1 });
// Unique compound index to prevent double booking (user cannot have 2 active bookings for same slot on same date)
bookingSchema.index({ userId: 1, date: 1, slotTime: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'booked' } });

module.exports = mongoose.model('Booking', bookingSchema);
