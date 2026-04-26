# GymFit - Gym Management System

A simple MERN-stack gym management application for tracking attendance and booking gym slots.

## Features

- **User Authentication**: Register/Login with JWT tokens
- **Role-based Access**: Separate views for members and admins
- **Daily Attendance Tracking**: Members mark daily presence
- **Slot Booking**: 5 fixed time slots per day (6-8AM, 8-10AM, 10-12PM, 5-7PM, 7-9PM)
- **Capacity Limits**: Max 20 members per slot to prevent overcrowding
- **Admin Dashboard**: View all bookings, attendance, and analytics

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Auth**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB** (make sure MongoDB is running on your system)
   ```bash
   # On Windows, start MongoDB service or run:
   mongod
   ```

3. **Configure environment** (optional)
   
   The app uses default configuration. To customize, create a `.env` file:
   ```
   JWT_SECRET=your_secret_key
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/gymBD
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5000`

## Default Usage

### First Time Setup
1. Open the app in your browser
2. Register an admin account (select "Administrator" role)
3. Register regular member accounts (select "Gym Member" role)
4. Login with appropriate credentials

### Member Features
- Mark daily attendance (once per day)
- View personal booking history
- Book available gym slots (max 20 per slot)
- Cancel upcoming bookings

### Admin Features
- View today's analytics (attendance count, total members, busiest slot)
- See all member bookings (filter by date)
- View attendance records
- Cancel any member's booking

## Project Structure

```
gym-project/
├── models/           # Mongoose schemas
│   ├── User.js
│   ├── Attendance.js
│   └── Booking.js
├── routes/           # Express route handlers
│   ├── auth.js
│   ├── attendance.js
│   ├── booking.js
│   └── admin.js
├── middleware/        # Custom middleware
│   └── auth.js       # JWT authentication
├── views/            # HTML pages
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── book-slot.html
│   └── admin.html
├── public/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/       # Static images
├── server.js         # Entry point
└── package.json
```

## Notes

- Each member can mark attendance once per day
- Each member can have only one active booking per slot per day
- Slots have a capacity limit of 20 members
- Cancelled bookings free up slot capacity
- Admin HTML redirects non-admin users to member dashboard
- JWT tokens expire in 10 hours

## Database Collections

- `users` – Registered members and admins
- `attendances` – Daily check-in records
- `bookings` – Gym slot reservations

---


