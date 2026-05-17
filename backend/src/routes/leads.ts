import { Router } from 'express';
import {
  createLead,
  deleteLead,
  exportLeadsCSV,
  getLeadById,
  getLeads,
  getLeadStats,
  updateLead,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';
import {
  createLeadValidators,
  leadQueryValidators,
  updateLeadValidators,
  validateRequest,
} from '../validators';
import { UserRole } from '../types';

const router = Router();

// All leads routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/leads/stats
 * @desc    Get lead statistics
 * @access  Private
 */
router.get('/stats', getLeadStats);

/**
 * @route   GET /api/leads/export
 * @desc    Export leads as CSV (Admin only)
 * @access  Private (Admin)
 */
router.get('/export', authorize(UserRole.ADMIN), exportLeadsCSV);

/**
 * @route   GET /api/leads
 * @desc    Get all leads with filtering, search, sorting, and pagination
 * @access  Private
 */
router.get('/', leadQueryValidators, validateRequest, getLeads);

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 * @access  Private
 */
router.post('/', createLeadValidators, validateRequest, createLead);

/**
 * @route   GET /api/leads/:id
 * @desc    Get a single lead by ID
 * @access  Private
 */
router.get('/:id', getLeadById);

/**
 * @route   PUT /api/leads/:id
 * @desc    Update a lead
 * @access  Private
 */
router.put('/:id', updateLeadValidators, validateRequest, updateLead);

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead (Admin or creator)
 * @access  Private
 */
router.delete('/:id', deleteLead);

export default router;
