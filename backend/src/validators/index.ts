import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { body, query } from 'express-validator';
import { LeadSource, LeadStatus } from '../types';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type, message: e.msg })),
    });
    return;
  }
  next();
};

export const registerValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
];

export const loginValidators = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const createLeadValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(Object.values(LeadSource)).withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

export const updateLeadValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .optional()
    .isIn(Object.values(LeadSource)).withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

export const leadQueryValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('status').optional().isIn(Object.values(LeadStatus)).withMessage('Invalid status filter'),
  query('source').optional().isIn(Object.values(LeadSource)).withMessage('Invalid source filter'),
  query('sort').optional().isIn(['latest', 'oldest']).withMessage('Sort must be latest or oldest'),
];
