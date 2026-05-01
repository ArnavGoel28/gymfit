import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import './models/User.js';
import './models/Attendance.js';
import './models/Booking.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gymBD';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const User = mongoose.model('User');
        const Attendance = mongoose.model('Attendance');
        const Booking = mongoose.model('Booking');

        // Clear existing sample data (optional - be careful!)
        // await User.deleteMany({ email: { $regex: /@sample.com$/ } });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        console.log('Creating sample users...');
        const users = [
            { name: 'John Doe', email: 'john@sample.com', password: hashedPassword, role: 'user' },
            { name: 'Jane Smith', email: 'jane@sample.com', password: hashedPassword, role: 'user' },
            { name: 'Mike Ross', email: 'mike@sample.com', password: hashedPassword, role: 'user' },
            { name: 'Sarah Connor', email: 'sarah@sample.com', password: hashedPassword, role: 'user' },
            { name: 'Admin User', email: 'admin@sample.com', password: hashedPassword, role: 'admin' }
        ];

        const createdUsers = [];
        for (const u of users) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = new User(u);
                await user.save();
                console.log(`Created user: ${u.name}`);
            }
            createdUsers.push(user);
        }

        const today = new Date().toISOString().split('T')[0];
        
        console.log('Creating sample attendance...');
        for (let i = 0; i < 3; i++) {
            const userId = createdUsers[i]._id;
            const existing = await Attendance.findOne({ userId, date: today });
            if (!existing) {
                const att = new Attendance({ userId, date: today });
                await att.save();
            }
        }

        console.log('Creating sample bookings...');
        const slots = ['6 AM - 8 AM', '8 AM - 10 AM', '5 PM - 7 PM'];
        for (let i = 0; i < 3; i++) {
            const userId = createdUsers[i]._id;
            const slotTime = slots[i % slots.length];
            const existing = await Booking.findOne({ userId, date: today, slotTime });
            if (!existing) {
                const book = new Booking({ userId, date: today, slotTime, status: 'booked' });
                await book.save();
            }
        }

        console.log('Seeding completed successfully!');
        console.log('Sample Login Email: admin@sample.com');
        console.log('Sample Login Password: password123');
        
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
