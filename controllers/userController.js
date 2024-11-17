// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ msg: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Upload an assignment
exports.uploadAssignment = async (req, res) => {
    const { task, adminId } = req.body;
    const userId = req.user.id;  // Get the authenticated user's ID (assumes user is authenticated via middleware)

    try {
        // Ensure the admin exists
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'Admin') {
            return res.status(400).json({ msg: 'Invalid admin ID provided' });
        }

        // Create a new assignment
        const assignment = new Assignment({
            userId,      // Use the authenticated user's ID
            task,
            admin: adminId // Set the admin ID
        });

        // Save the assignment
        await assignment.save();

        // Respond with success message
        res.status(201).json({ msg: 'Assignment uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' }).select('-password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
