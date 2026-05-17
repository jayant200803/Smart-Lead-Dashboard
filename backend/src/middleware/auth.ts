import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, IUserPayload, UserRole } from '../types';
import { sendError } from '../utils/response';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      sendError(res, 'Server configuration error', 500);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token has expired. Please log in again.', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 'Invalid token. Please log in again.', 401);
    } else {
      sendError(res, 'Authentication failed', 401);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      sendError(res, 'Access denied. Not authenticated.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
      return;
    }

    next();
  };
};
