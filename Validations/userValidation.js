const { z } = require('zod');

// User registration schema
const registerUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password cannot exceed 20 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
  
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(30, { message: 'Name cannot exceed 30 characters' })
    .regex(/^[a-zA-Z\s]*$/, { message: 'Name can only contain letters and spaces' }),

  role: z
    .literal('User', { message: 'Role must be "User"' })
});

// User login schema
const loginUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password cannot exceed 20 characters' }),
});

// Assignment upload schema
const uploadAssignmentSchema = z.object({
  task: z
    .string()
    .min(5, { message: 'Task description must be at least 5 characters long' })
    .max(500, { message: 'Task description cannot exceed 500 characters' }),

  adminId: z
    .string()
    .length(24, { message: 'Admin ID must be a valid MongoDB ObjectId' }),
});


// Validation middleware function to validate requests
const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (req.body) {
        schema.parse(req.body); 
      } else if (req.query) {
        schema.parse(req.query); 
      } else if (req.params) {
        schema.parse(req.params); 
      }
      next(); 
    } catch (error) {
      return res.status(400).json({
        msg: 'Validation failed',
        errors: error.errors, 
      });
    }
  };
};

// Export the schemas and validation function
module.exports = {
  registerUserSchema,
  loginUserSchema,
  uploadAssignmentSchema,
  validate,
};
