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

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'Admin',
        });
        
        await admin.save();

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

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

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

exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ admin: req.user.id })
            .populate({ path: 'userId', select: 'name' })  
            .populate({ path: 'admin', select: 'name' })   
            .select('-__v')                                
            .sort({ createdAt: -1 });                      

        res.json(assignments);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Accept an assignment
exports.acceptAssignment = async (req, res) => {
    try {
        const { id } = req.params;  
        const adminId = req.user._id; 

        
        const assignment = await Assignment.findOneAndUpdate(
            { _id: id, adminId: adminId },  
            { status: 'Accepted' },          
            { new: true }                    
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
