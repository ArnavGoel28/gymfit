const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/gymBD';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully to gymBD');
    console.log('✅ Database is ready for the GymFit app');
    return mongoose.connection.db.admin().ping();
})
.then(() => {
    console.log('✅ Database ping successful - gymBD is accessible');
    process.exit(0);
})
.catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
});
