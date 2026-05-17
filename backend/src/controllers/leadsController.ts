import { Response } from 'express';
import { stringify } from 'csv-stringify/sync';
import { Lead } from '../models/Lead';
import {
  AuthenticatedRequest,
  CreateLeadDto,
  LeadFilters,
  LeadQueryParams,
  LeadSource,
  LeadStatus,
  SortOrder,
  UpdateLeadDto,
  UserRole,
} from '../types';
import {
  buildPaginationMeta,
  sendError,
  sendPaginated,
  sendSuccess,
} from '../utils/response';
import { logger } from '../utils/logger';

const ITEMS_PER_PAGE = 10;

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const {
      page = '1',
      limit = String(ITEMS_PER_PAGE),
      status,
      source,
      search,
      sort = SortOrder.LATEST,
    } = req.query as LeadQueryParams;

    const currentPage = Math.max(1, parseInt(page, 10));
    const itemsPerPage = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (currentPage - 1) * itemsPerPage;

    // Build filter object
    const filters: LeadFilters = {};

    // Role-based: sales users only see their own leads
    if (req.user.role === UserRole.SALES) {
      (filters as Record<string, unknown>).createdBy = req.user.id;
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filters.status = status;
    }

    if (source && Object.values(LeadSource).includes(source)) {
      filters.source = source;
    }

    if (search && search.trim()) {
      const searchRegex = search.trim();
      filters.$or = [
        { name: { $regex: searchRegex, $options: 'i' } },
        { email: { $regex: searchRegex, $options: 'i' } },
      ];
    }

    const sortOrder = sort === SortOrder.OLDEST ? 1 : -1;

    const [leads, totalItems] = await Promise.all([
      Lead.find(filters as Record<string, unknown>)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      Lead.countDocuments(filters as Record<string, unknown>),
    ]);

    const pagination = buildPaginationMeta(totalItems, currentPage, itemsPerPage);

    sendPaginated(res, 'Leads retrieved successfully', leads, pagination);
  } catch (error) {
    logger.error('GetLeads error:', error);
    sendError(res, 'Failed to retrieve leads', 500, String(error));
  }
};

export const getLeadById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied', 403);
      return;
    }

    sendSuccess(res, 'Lead retrieved successfully', lead);
  } catch (error) {
    logger.error('GetLeadById error:', error);
    sendError(res, 'Failed to retrieve lead', 500, String(error));
  }
};

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const dto: CreateLeadDto = req.body;

    const lead = await Lead.create({
      ...dto,
      createdBy: req.user.id,
    });

    await lead.populate('createdBy', 'name email');

    logger.info(`Lead created: ${lead._id} by ${req.user.email}`);
    sendSuccess(res, 'Lead created successfully', lead, 201);
  } catch (error) {
    logger.error('CreateLead error:', error);
    sendError(res, 'Failed to create lead', 500, String(error));
  }
};

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied', 403);
      return;
    }

    const dto: UpdateLeadDto = req.body;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: dto },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    logger.info(`Lead updated: ${req.params.id} by ${req.user.email}`);
    sendSuccess(res, 'Lead updated successfully', updatedLead);
  } catch (error) {
    logger.error('UpdateLead error:', error);
    sendError(res, 'Failed to update lead', 500, String(error));
  }
};

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Only admins or lead creators can delete
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);

    logger.info(`Lead deleted: ${req.params.id} by ${req.user.email}`);
    sendSuccess(res, 'Lead deleted successfully');
  } catch (error) {
    logger.error('DeleteLead error:', error);
    sendError(res, 'Failed to delete lead', 500, String(error));
  }
};

export const exportLeadsCSV = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const filters: Record<string, unknown> = {};
    if (req.user.role === UserRole.SALES) {
      filters.createdBy = req.user.id;
    }

    const { status, source, search } = req.query as LeadQueryParams;

    if (status) filters.status = status;
    if (source) filters.source = source;
    if (search?.trim()) {
      filters.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filters)
      .populate<{ createdBy: { name: string; email: string } }>('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const csvData = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      Notes: lead.notes ?? '',
      'Created By': typeof lead.createdBy === 'object' ? lead.createdBy.name : '',
      'Created At': new Date(lead.createdAt).toLocaleDateString(),
    }));

    const csv = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads-export-${Date.now()}.csv"`
    );

    res.send(csv);
  } catch (error) {
    logger.error('ExportLeadsCSV error:', error);
    sendError(res, 'Failed to export leads', 500, String(error));
  }
};

export const getLeadStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Not authenticated', 401); return; }

    const matchFilter: Record<string, unknown> =
      req.user.role === UserRole.SALES ? { createdBy: req.user.id } : {};

    const [statusStats, sourceStats, totalCount] = await Promise.all([
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(matchFilter),
    ]);

    const stats = {
      total: totalCount,
      byStatus: statusStats.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => {
          acc[item._id] = item.count;
          return acc;
        },
        {}
      ),
      bySource: sourceStats.reduce(
        (acc: Record<string, number>, item: { _id: string; count: number }) => {
          acc[item._id] = item.count;
          return acc;
        },
        {}
      ),
    };

    sendSuccess(res, 'Stats retrieved successfully', stats);
  } catch (error) {
    logger.error('GetLeadStats error:', error);
    sendError(res, 'Failed to retrieve stats', 500, String(error));
  }
};
