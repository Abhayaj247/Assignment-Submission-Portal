const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// Admin registration
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'Admin', // Set role as 'Admin'
        });
        
        await admin.save(); // Save the admin to the database

        res.status(201).json({ msg: 'Admin registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Admin login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Admin not found' });
        }

        // Compare the input password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all assignments tagged to the admin
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ admin: req.user.id })
            .populate({ path: 'userId', select: 'name' })   // Populate userId with name only
            .populate({ path: 'admin', select: 'name' })    // Populate admin with name only
            .select('-__v')                                 // Exclude the `__v` field
            .sort({ createdAt: -1 });                       // Sort by most recent

        res.json(assignments);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Accept an assignment
exports.acceptAssignment = async (req, res) => {
    try {
        const { id } = req.params;  // Get the assignment ID from the URL parameter
        const adminId = req.user._id;  // Get the logged-in admin's ID from the token

        // Find the assignment by ID and update its status to "Accepted"
        const assignment = await Assignment.findOneAndUpdate(
            { _id: id, adminId: adminId },  // Ensure the assignment belongs to the admin
            { status: 'Accepted' },          // Update status
            { new: true }                    // Return the updated assignment
        );

        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found or not assigned to this admin' });
        }

        return res.status(200).json({ msg: 'Assignment accepted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Reject an assignment
exports.rejectAssignment = async (req, res) => {
    try {
        await Assignment.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
        res.json({ msg: 'Assignment rejected' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
