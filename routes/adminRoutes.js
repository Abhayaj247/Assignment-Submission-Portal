// routes/adminRoutes.js
const express = require('express');
const { register, login, getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { validate, registerAdminSchema, loginAdminSchema, acceptAssignmentSchema, rejectAssignmentSchema } = require('../Validations/adminValidation');
const router = express.Router();

router.post('/register', validate(registerAdminSchema), register);
router.post('/login', validate(loginAdminSchema), login);
router.get('/assignments', auth, getAssignments);
router.post('/assignments/:id/accept', auth, acceptAssignment);
router.post('/assignments/:id/reject', auth, rejectAssignment);

module.exports = router;
