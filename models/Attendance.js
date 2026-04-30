import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);

