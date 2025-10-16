"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSettingsUpdate = exports.validateSubscription = exports.validateExperienceTitle = exports.validateExperience = exports.validateCertification = exports.validateRemoveSkill = exports.validateAddSkill = exports.validatePrimaryUpdate = exports.validateBankDetail = exports.validateContactForm = exports.validateProfileUpdate = exports.handleValidationErrors = void 0;
exports.generate2FACode = generate2FACode;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
function generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
exports.validateProfileUpdate = [
    (0, express_validator_1.body)("firstName").optional().isString().isLength({ min: 2 }),
    (0, express_validator_1.body)("lastName").optional().isString().isLength({ min: 2 }),
    (0, express_validator_1.body)("username").optional().isString(),
    (0, express_validator_1.body)("bio").optional().isLength({ max: 1000 }),
    (0, express_validator_1.body)("profileImg").optional().isURL(),
];
exports.validateContactForm = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    (0, express_validator_1.body)('phoneNumber')
        .trim()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('emailAddress')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
];
exports.validateBankDetail = [
    (0, express_validator_1.body)('accountNumber').notEmpty().withMessage('Account number is required'),
    (0, express_validator_1.body)('bankName').notEmpty().withMessage('Bank name is required'),
    (0, express_validator_1.body)('accountName').notEmpty().withMessage('Account name is required'),
];
exports.validatePrimaryUpdate = [
    (0, express_validator_1.body)('accountNumber').notEmpty().withMessage('Account number is required'),
];
exports.validateAddSkill = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Skill title is required'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
];
exports.validateRemoveSkill = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Skill title is required to remove'),
];
exports.validateCertification = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('organisation').notEmpty().withMessage('Organisation is required'),
    (0, express_validator_1.body)('issuedDate').notEmpty().isISO8601().withMessage('Valid issued date required'),
];
exports.validateExperience = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("company").notEmpty().withMessage("Company is required"),
    (0, express_validator_1.body)("startDate").isISO8601().withMessage("Start date must be valid"),
    (0, express_validator_1.body)("endDate").optional().isISO8601().withMessage("End date must be valid"),
];
exports.validateExperienceTitle = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Experience title is required"),
];
exports.validateSubscription = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Subscription name is required"),
    (0, express_validator_1.body)("startDate")
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601()
        .withMessage("Start date must be a valid ISO8601 date"),
    (0, express_validator_1.body)("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date must be a valid ISO8601 date"),
    (0, express_validator_1.body)("status")
        .isIn(["active", "expired", "cancelled"])
        .withMessage("Status must be 'active', 'expired', or 'cancelled'"),
    (0, express_validator_1.body)("amount")
        .isNumeric()
        .withMessage("Amount must be a number"),
    (0, express_validator_1.body)("autoRenew")
        .optional()
        .isBoolean()
        .withMessage("Auto renew must be a boolean"),
];
exports.validateSettingsUpdate = [
    (0, express_validator_1.body)('profileVisible').optional().isBoolean().withMessage('profileVisible must be a boolean'),
    (0, express_validator_1.body)('emailNotifications').optional().isBoolean().withMessage('emailNotifications must be a boolean'),
];
