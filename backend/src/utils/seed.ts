import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { LeadSource, LeadStatus, UserRole } from '../types';

const seedDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'Admin@123',
      role: UserRole.ADMIN,
    });

    // Create sales user
    const salesUser = await User.create({
      name: 'Sales User',
      email: 'sales@smartleads.com',
      password: 'Sales@123',
      role: UserRole.SALES,
    });

    // Sample leads data
    const leadsData = [
      { name: 'Rahul Sharma', email: 'rahul@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM, notes: 'Interested in enterprise plan' },
      { name: 'Priya Patel', email: 'priya@example.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, notes: 'Downloaded whitepaper' },
      { name: 'Amit Kumar', email: 'amit@example.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, notes: 'Referred by Rahul' },
      { name: 'Sneha Singh', email: 'sneha@example.com', status: LeadStatus.LOST, source: LeadSource.WEBSITE, notes: 'Budget constraints' },
      { name: 'Vikram Reddy', email: 'vikram@example.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, notes: 'Clicked on ad' },
      { name: 'Ananya Gupta', email: 'ananya@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, notes: 'High interest' },
      { name: 'Rohan Mehta', email: 'rohan@example.com', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE },
      { name: 'Kavya Nair', email: 'kavya@example.com', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM },
      { name: 'Arjun Iyer', email: 'arjun@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, notes: 'Demo scheduled' },
      { name: 'Deepika Joshi', email: 'deepika@example.com', status: LeadStatus.LOST, source: LeadSource.REFERRAL, notes: 'Went with competitor' },
      { name: 'Sanjay Verma', email: 'sanjay@example.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE },
      { name: 'Meera Rao', email: 'meera@example.com', status: LeadStatus.CONTACTED, source: LeadSource.INSTAGRAM, notes: 'Follow up next week' },
    ];

    const adminLeads = leadsData.slice(0, 8).map(l => ({ ...l, createdBy: admin._id }));
    const salesLeads = leadsData.slice(8).map(l => ({ ...l, createdBy: salesUser._id }));

    await Lead.insertMany([...adminLeads, ...salesLeads]);

    console.log('✅ Seed completed!');
    console.log('Admin: admin@smartleads.com / Admin@123');
    console.log('Sales: sales@smartleads.com / Sales@123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
