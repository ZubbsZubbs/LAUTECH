import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
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

export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const validateProfileUpdate = [
  body("firstName").optional().isString().isLength({ min: 2 }),
  body("lastName").optional().isString().isLength({ min: 2 }),
  body("username").optional().isString(),
  body("bio").optional().isLength({ max: 1000 }),
  body("profileImg").optional().isURL(),
];

export const validateContactForm = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),

  body('phoneNumber')
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('emailAddress')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];


export const validateBankDetail = [
  body('accountNumber').notEmpty().withMessage('Account number is required'),
  body('bankName').notEmpty().withMessage('Bank name is required'),
  body('accountName').notEmpty().withMessage('Account name is required'),
];

export const validatePrimaryUpdate = [
  body('accountNumber').notEmpty().withMessage('Account number is required'),
];

export const validateAddSkill = [
  body('title')
    .notEmpty()
    .withMessage('Skill title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

export const validateRemoveSkill = [
  body('title')
    .notEmpty()
    .withMessage('Skill title is required to remove'),
];


export const validateCertification = [
  body('title').notEmpty().withMessage('Title is required'),
  body('organisation').notEmpty().withMessage('Organisation is required'),
  body('issuedDate').notEmpty().isISO8601().withMessage('Valid issued date required'),
];


export const validateExperience = [
  body("title").notEmpty().withMessage("Title is required"),
  body("company").notEmpty().withMessage("Company is required"),
  body("startDate").isISO8601().withMessage("Start date must be valid"),
  body("endDate").optional().isISO8601().withMessage("End date must be valid"),
];

export const validateExperienceTitle = [
  body("title").notEmpty().withMessage("Experience title is required"),
];


export const validateSubscription = [
  body("name")
    .notEmpty()
    .withMessage("Subscription name is required"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO8601 date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO8601 date"),

  body("status")
    .isIn(["active", "expired", "cancelled"])
    .withMessage("Status must be 'active', 'expired', or 'cancelled'"),

  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number"),

  body("autoRenew")
    .optional()
    .isBoolean()
    .withMessage("Auto renew must be a boolean"),
];


export const validateSettingsUpdate = [
  body('profileVisible').optional().isBoolean().withMessage('profileVisible must be a boolean'),
  body('emailNotifications').optional().isBoolean().withMessage('emailNotifications must be a boolean'),
];

