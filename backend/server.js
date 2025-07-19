require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const challengeRoutes = require('./routes/challengeRoutes.js');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/completed-challenges', challengeRoutes);

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});