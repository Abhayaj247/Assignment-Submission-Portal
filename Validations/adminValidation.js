const { isObjectIdOrHexString, isValidObjectId } = require('mongoose');
const { z } = require('zod');

// Admin register schema
const registerAdminSchema = z.object({
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
    .literal('Admin', { message: 'Role must be "Admin"' })
});

// Admin login schema
const loginAdminSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password cannot exceed 20 characters' }),
});

// Validation middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body); 
    if (!result.success) {
      return res.status(400).json({
        msg: 'Validation error',
        errors: result.error.errors.map(e => e.message),
      });
    }

   
    next();
  };
};

// Export the schemas and validation function
module.exports = {
  registerAdminSchema,
  loginAdminSchema,
  validate,
};
