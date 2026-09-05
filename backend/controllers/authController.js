const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { email, password, companyName } = req.body;
        const user = new User({ email, password, companyName });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, email: user.email, companyName: user.companyName } });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, companyName: user.companyName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
