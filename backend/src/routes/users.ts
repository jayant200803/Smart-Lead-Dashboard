import { Router, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { User } from '../models/User';
import { AuthenticatedRequest, UserRole } from '../types';
import { sendError, sendSuccess } from '../utils/response';

const router = Router();

router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/', authorize(UserRole.ADMIN), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').lean();
    sendSuccess(res, 'Users retrieved successfully', users);
  } catch (error) {
    sendError(res, 'Failed to retrieve users', 500, String(error));
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authorize(UserRole.ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }
    if (req.params.id === req.user.id) {
      sendError(res, 'You cannot delete your own account', 400);
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete user', 500, String(error));
  }
});

export default router;
