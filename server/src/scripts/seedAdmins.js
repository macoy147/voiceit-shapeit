import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Admin accounts to seed
const ADMIN_ACCOUNTS = [
  {
    username: 'ssg2526pres',
    password: 'President2526!',
    role: 'executive',
    label: 'President',
    color: '#8b5cf6'
  },
  {
    username: 'ssg2526vp',
    password: 'VicePresident2526!',
    role: 'executive',
    label: 'Vice President',
    color: '#ec4899'
  },
  {
    username: 'ssg2526cote',
    password: 'CoTEGov2526!',
    role: 'executive',
    label: 'CoTE Governor',
    color: '#3b82f6'
  },
  {
    username: 'ssg2526coed',
    password: 'CoEdGov2526!',
    role: 'executive',
    label: 'CoEd Governor',
    color: '#14b8a6'
  },
  {
    username: 'ssg2526presssec',
    password: 'PressSec2526!',
    role: 'press_secretary',
    label: 'Press Secretary',
    color: '#f59e0b'
  },
  {
    username: 'ssg2526netsec',
    password: 'NetSec2526!',
    role: 'network_secretary',
    label: 'Secretary on Networks',
    color: '#10b981'
  },
  {
    username: 'ssg2526dev',
    password: 'Developer2526!',
    role: 'developer',
    label: 'Developer',
    color: '#6366f1'
  },
  {
    username: 'ssg2526mathrep',
    password: 'MathRep2526!',
    role: 'executive',
    label: 'BSED-Math Representative',
    color: '#f472b6'
  },
  {
    username: 'ssg2526smm',
    password: 'SocialMedia2526!',
    role: 'press_secretary',
    label: 'Social Media Manager',
    color: '#06b6d4'
  }
];

async function seedAdmins() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing admins (optional - comment out if you want to keep existing)
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      logger.info(`Found ${existingCount} existing admin(s). Clearing...`);
      await Admin.deleteMany({});
      logger.info('Existing admins cleared');
    }

    // Insert admin accounts
    logger.info('Seeding admin accounts...');
    
    for (const adminData of ADMIN_ACCOUNTS) {
      const admin = new Admin({
        ...adminData,
        createdBy: 'seed_script'
      });
      
      await admin.save();
      logger.info(`✓ Created admin: ${admin.username} (${admin.label})`);
    }

    logger.info(`\n✅ Successfully seeded ${ADMIN_ACCOUNTS.length} admin accounts!`);
    
    // Display credentials
    console.log('\n📋 ADMIN CREDENTIALS:');
    console.log('═══════════════════════════════════════════════════════════');
    ADMIN_ACCOUNTS.forEach(admin => {
      console.log(`Username: ${admin.username.padEnd(20)} | Password: ${admin.password.padEnd(20)} | Role: ${admin.label}`);
    });
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change these passwords in production!\n');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding admins:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmins();
