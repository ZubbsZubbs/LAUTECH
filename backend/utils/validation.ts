import Joi from 'joi';
import validator from 'validator';

// Email validation
export const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  });

// Password validation with strength requirements
export const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    'any.required': 'Password is required'
  });

// Name validation
export const nameSchema = Joi.string()
  .min(2)
  .max(50)
  .pattern(/^[a-zA-Z\s'-]+$/)
  .required()
  .messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 50 characters',
    'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
    'any.required': 'Name is required'
  });

// Registration validation schema
export const registrationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema
});

// Login validation schema
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Admin creation validation schema
export const adminCreationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  adminKey: Joi.string().required().messages({
    'any.required': 'Admin key is required'
  })
});

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return validator.escape(validator.trim(input));
};

// Validate and sanitize email
export const validateAndSanitizeEmail = (email: string): string => {
  const sanitized = sanitizeInput(email);
  if (!validator.isEmail(sanitized)) {
    throw new Error('Invalid email format');
  }
  return sanitized.toLowerCase();
};

// Validate password strength
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
