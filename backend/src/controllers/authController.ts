import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthenticatedRequest, IUserPayload, LoginDto, RegisterDto } from '../types';
import { sendError, sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';

const generateToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role }: RegisterDto = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'A user with this email already exists', 409);
      return;
    }

    const user = await User.create({ name, email, password, role });

    const payload: IUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(payload);

    logger.info(`New user registered: ${email}`);

    sendSuccess(
      res,
      'Registration successful',
      { user: payload, token },
      201
    );
  } catch (error) {
    logger.error('Register error:', error);
    sendError(res, 'Registration failed', 500, String(error));
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginDto = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const payload: IUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(payload);

    logger.info(`User logged in: ${email}`);

    sendSuccess(res, 'Login successful', { user: payload, token });
  } catch (error) {
    logger.error('Login error:', error);
    sendError(res, 'Login failed', 500, String(error));
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'User profile retrieved', {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    logger.error('GetMe error:', error);
    sendError(res, 'Failed to retrieve profile', 500, String(error));
  }
};
