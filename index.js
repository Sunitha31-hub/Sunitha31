const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: { type: [String], default: [] }, 
});

const User = mongoose.model("User", UserSchema);


app.post('/register', async (req, res) => {
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


app.post('/login', async (req, res) => {
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


app.post('/preferences', async (req, res) => {
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


app.post('/news-feed', async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


