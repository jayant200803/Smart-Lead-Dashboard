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

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

/** Populated createdBy object when the API returns user details. */
export interface LeadCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: LeadCreatedBy | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
}

// ─── Stats Types ──────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  byStatus: Partial<Record<LeadStatus, number>>;
  bySource: Partial<Record<LeadSource, number>>;
}
