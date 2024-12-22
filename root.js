const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: { type: [String], default: [] }, // User preferences
});
const User = mongoose.model("User", UserSchema);


router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Error registering user' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, interests: user.interests } });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
});


router.post('/preferences', async (req, res) => {
    const { token, interests } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.interests = interests;
        await user.save();
        res.json({ message: 'Preferences saved successfully!' });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});


router.post('/news-feed', async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        
        const news = user.interests.map(interest => ({
            category: interest,
            articles: [`Article 1 about ${interest}`, `Article 2 about ${interest}`],
        }));

        res.json(news);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
