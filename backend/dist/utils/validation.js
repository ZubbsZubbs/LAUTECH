"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordStrength = exports.validateAndSanitizeEmail = exports.sanitizeInput = exports.adminCreationSchema = exports.loginSchema = exports.registrationSchema = exports.nameSchema = exports.passwordSchema = exports.emailSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validator_1 = __importDefault(require("validator"));
// Email validation
exports.emailSchema = joi_1.default.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
});
// Password validation with strength requirements
exports.passwordSchema = joi_1.default.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    'any.required': 'Password is required'
});
// Name validation
exports.nameSchema = joi_1.default.string()
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
exports.registrationSchema = joi_1.default.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    firstName: exports.nameSchema,
    lastName: exports.nameSchema
});
// Login validation schema
exports.loginSchema = joi_1.default.object({
    email: exports.emailSchema,
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required'
    })
});
// Admin creation validation schema
exports.adminCreationSchema = joi_1.default.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    firstName: exports.nameSchema,
    lastName: exports.nameSchema,
    adminKey: joi_1.default.string().required().messages({
        'any.required': 'Admin key is required'
    })
});
// Input sanitization
const sanitizeInput = (input) => {
    return validator_1.default.escape(validator_1.default.trim(input));
};
exports.sanitizeInput = sanitizeInput;
// Validate and sanitize email
const validateAndSanitizeEmail = (email) => {
    const sanitized = (0, exports.sanitizeInput)(email);
    if (!validator_1.default.isEmail(sanitized)) {
        throw new Error('Invalid email format');
    }
    return sanitized.toLowerCase();
};
exports.validateAndSanitizeEmail = validateAndSanitizeEmail;
// Validate password strength
const validatePasswordStrength = (password) => {
    const errors = [];
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
exports.validatePasswordStrength = validatePasswordStrength;
