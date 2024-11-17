// routes/userRoutes.js
const express = require('express');
const { register, login, uploadAssignment, getAllAdmins } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validate, registerUserSchema, loginUserSchema, uploadAssignmentSchema } = require('../Validations/userValidation');
const router = express.Router();

router.post('/register',validate(registerUserSchema), register);
router.post('/login', validate(loginUserSchema), login);
router.post('/upload', auth, validate(uploadAssignmentSchema), uploadAssignment);
router.get('/admins', auth, getAllAdmins); // Route to fetch all admins

module.exports = router;
