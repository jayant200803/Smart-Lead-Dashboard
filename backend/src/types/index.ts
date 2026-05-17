import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export enum SortOrder {
  LATEST = 'latest',
  OLDEST = 'oldest',
}

// ─── User Types ───────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Query Types ──────────────────────────────────────────────────────────────

export interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

// ─── DTO Types ────────────────────────────────────────────────────────────────

export interface CreateLeadDto {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}
