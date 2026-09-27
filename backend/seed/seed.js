import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Category from '../models/Category.js';
import Notification from '../models/Notification.js';
import PlatformSettings from '../models/PlatformSettings.js';

import { mockUsers } from '../../src/data/mockUsers.js';
import { mockEvents } from '../../src/data/mockEvents.js';
import { mockCategories } from '../../src/data/mockCategories.js';
import { mockNotifications } from '../../src/data/mockNotifications.js';

const initialRegistrations = [
  {
    eventSlug: 'innovatex-2026-hackathon',
    studentEmail: 'debjit.banerjee@campus.edu',
    ticketTier: 'VIP Hacker Pass',
    seating: 'Main Computing Lab - Pod A',
    dietary: 'Vegetarian',
    specialRequirements: 'Requires 24/7 power point for laptop',
    attendance: 'Pending',
    teamName: 'Neural Innovators',
    teamMembers: ['Debjit Banerjee', 'Priya Sundaram', 'Arjun Nambiar'],
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    registeredAt: new Date('2026-08-20T10:30:00Z'),
  },
  {
    eventSlug: 'generative-ai-llm-workshop',
    studentEmail: 'debjit.banerjee@campus.edu',
    ticketTier: 'Masterclass Delegate',
    seating: 'Tiered Auditorium Row 2',
    dietary: 'Non-Veg',
    specialRequirements: 'Pre-provisioned GPU sandbox',
    attendance: 'Present',
    teamName: 'Solo Participant',
    teamMembers: ['Debjit Banerjee'],
    paymentStatus: 'paid',
    paymentMethod: 'Free Workshop',
    registeredAt: new Date('2026-08-22T14:15:00Z'),
  },
  {
    eventSlug: 'tarang-2026-cultural-fest',
    studentEmail: 'priya.sundaram@campus.edu',
    ticketTier: 'General Admission',
    seating: 'Open Grounds - Zone C',
    dietary: 'Vegetarian',
    specialRequirements: '',
    attendance: 'Pending',
    teamName: 'Solo Participant',
    teamMembers: ['Priya Sundaram'],
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    registeredAt: new Date('2026-08-24T09:05:00Z'),
  },
  {
    eventSlug: 'robowars-drone-challenge',
    studentEmail: 'rohan.mukherjee@campus.edu',
    ticketTier: 'Drone League Pass',
    seating: 'Robotics Arena - Bay 2',
    dietary: 'Non-Veg',
    specialRequirements: '',
    attendance: 'Pending',
    teamName: 'Solo Participant',
    teamMembers: ['Rohan Mukherjee'],
    // Paid event, still sitting in the admin review queue.
    status: 'Pending',
    paymentStatus: 'unpaid',
    paymentMethod: '',
    registeredAt: new Date('2026-08-25T11:45:00Z'),
  },
  {
    eventSlug: 'quantum-computing-symposium-2026',
    studentEmail: 'sneha.patel@campus.edu',
    ticketTier: 'Lab Access Pass',
    seating: 'Quantum Lab 2',
    dietary: 'Jain',
    specialRequirements: '',
    attendance: 'Pending',
    teamName: 'Solo Participant',
    teamMembers: ['Sneha Patel'],
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    registeredAt: new Date('2026-08-26T16:20:00Z'),
  },
  {
    eventSlug: 'cricket-premier-league-2026',
    studentEmail: 'arjun.nambiar@campus.edu',
    ticketTier: 'Player Registration',
    seating: 'Main Ground - West Pavilion',
    dietary: 'Vegetarian',
    specialRequirements: '',
    attendance: 'Pending',
    teamName: 'Solo Participant',
    teamMembers: ['Arjun Nambiar'],
    // Approved by the admin but the fee is still outstanding.
    status: 'Approved',
    paymentStatus: 'unpaid',
    paymentMethod: '',
    registeredAt: new Date('2026-08-27T08:10:00Z'),
  },
  {
    // Free event + paid: keeps 'partial' (mixed paid/unpaid) filter demonstrable.
    eventSlug: 'innovatex-2026-hackathon',
    studentEmail: 'rohan.mukherjee@campus.edu',
    ticketTier: 'Open Hacker Pass',
    seating: 'Main Computing Lab - Pod D',
    dietary: 'Non-Veg',
    specialRequirements: '',
    attendance: 'Pending',
    teamName: 'Solo Participant',
    teamMembers: ['Rohan Mukherjee'],
    status: 'Approved',
    paymentStatus: 'paid',
    paymentMethod: 'Free Entry',
    registeredAt: new Date('2026-08-28T10:00:00Z'),
  },
  {
    // Rejected application: shows the reason and lets the student apply again.
    eventSlug: 'chanakya-parliamentary-debate-2026',
    studentEmail: 'vikram.sengupta@campus.edu',
    ticketTier: 'Debate Delegate',
    seating: 'Senate Hall - Row 3',
    dietary: 'Veg',
    specialRequirements: '',
    attendance: 'Pending',
    teamName: 'Solo Participant',
    teamMembers: ['Vikram Sengupta'],
    status: 'Rejected',
    rejectReason: 'Registration for this debate closed while your application was under review.',
    paymentStatus: 'unpaid',
    paymentMethod: '',
    registeredAt: new Date('2026-08-29T09:30:00Z'),
  },
];

const DEMO_PASSWORD = 'password123';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';
const PENDING_STUDENT = {
  name: 'Kavya Iyer',
  email: 'kavya.iyer@campus.edu',
  role: 'student',
  status: 'pending',
};

const wipeDatabase = async () => {
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
    Category.deleteMany({}),
    Notification.deleteMany({}),
    PlatformSettings.deleteMany({}),
  ]);
  console.log('→ Old data cleared.\n');
};

const seedUsers = async () => {
  console.log('Seeding users...');
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);

  const users = mockUsers.map((u) => ({
    ...u,
    email: u.email.toLowerCase(),
    // The organizer role no longer exists; every seeded account is a student or admin
    role: u.role === 'admin' ? 'admin' : 'student',
    status: 'active',
    approvedAt: new Date('2026-08-01T09:00:00Z'),
    password: hashed,
  }));

  users.push({
    name: PENDING_STUDENT.name,
    email: PENDING_STUDENT.email,
    password: hashed,
    role: 'student',
    status: 'pending',
    studentId: 'CSE-26-4417',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: 'VI',
    phone: '+91 90000 44177',
    bio: 'Awaiting admin approval.',
    skills: ['JavaScript', 'React'],
    joinedDate: 'September 2026',
  });

  users.push({
    name: 'CampusConnect System Admin',
    email: ADMIN_EMAIL,
    // insertMany() does not trigger the schema's pre('save') hashing hook
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: 'admin',
    status: 'active',
    approvedAt: new Date('2026-08-01T09:00:00Z'),
    studentId: 'ADM-ROOT-001',
    department: 'Office of Student Affairs & Deanery',
    year: 'Administration',
    semester: 'Administration',
    phone: '+91 90000 00000',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'System administrator with full platform access.',
    skills: ['Platform Admin', 'Governance'],
    joinedDate: 'August 2026',
  });

  const created = await User.insertMany(users, { ordered: false });
  console.log(`→ ${created.length} users created.`);
  console.log(`   Demo credentials → password: ${DEMO_PASSWORD}`);
  console.log(`   Admin login      → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`   Pending student  → ${PENDING_STUDENT.email} / ${DEMO_PASSWORD}\n`);
  return created;
};

const seedCategories = async () => {
  console.log('Seeding categories...');
  const categories = mockCategories.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    color: c.color,
    badgeBg: c.badgeBg,
    count: c.count,
  }));
  await Category.insertMany(categories);
  console.log(`→ ${categories.length} categories created.\n`);
  return categories;
};

const derivePrice = (event) => {
  if (event.priceAmount !== undefined && event.priceAmount !== null) return Number(event.priceAmount) || 0;
  const match = /(\d[\d,]*)/.exec(String(event.price || ''));
  return match ? Number(match[1].replace(/,/g, '')) : 0;
};

const priceLabel = (amount) => (amount > 0 ? `Rs.${amount}` : 'Free');

const seedEvents = async (admin, categories) => {
  console.log('Seeding events...');
  const catMap = new Map(categories.map((c) => [c.slug, c]));

  const events = mockEvents.map((e) => {
    const priceAmount = derivePrice(e);
    return {
      title: e.title,
      slug: e.slug,
      category: e.category,
      categoryLabel: e.categoryLabel || catMap.get(e.category)?.name || e.category,
      banner: e.banner,
      date: e.date,
      formattedDate: e.formattedDate,
      time: e.time,
      endTime: e.endTime,
      venue: e.venue,
      type: e.type,
      organizer: {
        name: admin.name,
        club: e.department || 'Campus Administration',
        avatar: admin.avatar || '',
        email: admin.email,
        phone: admin.phone || '',
      },
      organizerUser: admin._id,
      department: e.department,
      maxParticipants: e.maxParticipants,
      registeredCount: 0,
      seatsLeft: e.maxParticipants,
      status: e.status === 'Sold Out' ? 'Sold Out' : 'Available',
      approvalStatus: 'Approved',
      registrationDeadline: e.registrationDeadline,
      isFeatured: !!e.isFeatured,
      price: priceLabel(priceAmount),
      priceAmount,
      tags: e.tags || [],
      prizes: e.prizes,
      description: e.description,
      eligibility: e.eligibility,
      rules: e.rules || [],
      schedule: e.schedule || [],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
    };
  });

  const created = await Event.insertMany(events, { ordered: false });
  console.log(`→ ${created.length} events created.\n`);
  return created;
};

const seedRegistrations = async (users, events) => {
  console.log('Seeding registrations & payments...');
  const eventBySlug = new Map(events.map((e) => [e.slug, e]));
  const userByEmail = new Map(users.map((u) => [u.email, u]));
  const adminUser = users.find((u) => u.email === ADMIN_EMAIL);

  const regs = initialRegistrations
    .filter((r) => eventBySlug.has(r.eventSlug) && userByEmail.has(r.studentEmail))
    .map((r) => {
      const event = eventBySlug.get(r.eventSlug);
      const student = userByEmail.get(r.studentEmail);
      const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      return {
        registrationId: `CC-${new Date().getFullYear()}-${randomHex}`,
        event: event._id,
        user: student._id,
        eventTitle: event.title,
        category: event.category,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue,
        banner: event.banner,
        studentName: student.name,
        studentEmail: student.email,
        studentId: student.studentId,
        department: student.department,
        ticketTier: r.ticketTier,
        seating: r.seating,
        dietary: r.dietary,
        specialRequirements: r.specialRequirements,
        status: r.status || 'Approved',
        appliedAt: r.appliedAt || r.registeredAt,
        reviewedAt: r.status === 'Pending' ? null : new Date(r.registeredAt.getTime() + 1800000),
        reviewedBy: r.status === 'Pending' ? null : adminUser?._id || null,
        rejectReason: r.rejectReason || '',
        paymentStatus: r.paymentStatus,
        amountPaid: event.priceAmount,
        paidAt: r.paymentStatus === 'paid' ? new Date(r.registeredAt.getTime() + 3600000) : null,
        paymentMethod: r.paymentMethod,
        attendance: r.attendance,
        teamName: r.teamName,
        teamMembers: r.teamMembers,
        createdAt: r.registeredAt,
      };
    });

  if (regs.length) {
    await Registration.insertMany(regs, { ordered: false });

    // Only live applications (Pending/Approved) hold a seat.
    for (const reg of regs) {
      if (reg.status === 'Pending' || reg.status === 'Approved') {
        await Event.updateOne(
          { _id: reg.event },
          { $inc: { registeredCount: 1, seatsLeft: -1 } }
        );
      }
    }
  }

  const paid = regs.filter((r) => r.paymentStatus === 'paid' && r.status === 'Approved').length;
  const pending = regs.filter((r) => r.status === 'Pending').length;
  const rejected = regs.filter((r) => r.status === 'Rejected').length;
  console.log(
    `→ ${regs.length} registrations created (${paid} approved+paid, ${pending} awaiting approval, ${rejected} rejected).\n`
  );
  return regs;
};

const seedNotifications = async (users) => {
  console.log('Seeding notifications...');
  const demoStudent = users.find((u) => u.email === 'debjit.banerjee@campus.edu');
  const pendingStudent = users.find((u) => u.email === PENDING_STUDENT.email);
  const admin = users.find((u) => u.email === ADMIN_EMAIL);

  const offsetHours = 10;
  const notifDocs = mockNotifications.map((n, i) => ({
    user: demoStudent._id,
    title: n.title,
    message: n.message,
    category: n.category,
    read: n.read,
    link: '/student/dashboard',
    createdAt: new Date(Date.now() - (offsetHours + i * 3) * 3600000),
  }));
  await Notification.insertMany(notifDocs, { ordered: false });
  console.log(`→ ${notifDocs.length} notifications created for ${demoStudent.name}.`);

  const systemDocs = [
    {
      user: pendingStudent._id,
      title: 'Account pending approval',
      message: 'Your CampusConnect account is waiting for admin approval. You will be able to log in once approved.',
      category: 'system',
      read: false,
      link: '/login',
    },
    {
      user: admin._id,
      title: 'New student awaiting approval',
      message: `${pendingStudent.name} (${pendingStudent.email}) signed up and is pending approval.`,
      category: 'system',
      read: false,
      link: '/admin/students',
    },
    {
      user: admin._id,
      title: 'Welcome to the Admin Portal',
      message: 'You can manage student approvals, events, and payments from here.',
      category: 'system',
      read: false,
      link: '/admin/dashboard',
    },
  ];
  await Notification.insertMany(systemDocs, { ordered: false });
  console.log(`→ ${systemDocs.length} system notifications created.\n`);
};

const seedSettings = async () => {
  console.log('Seeding platform settings...');
  await PlatformSettings.create({});
  console.log('→ Platform settings created.\n');
};

const run = async () => {
  await connectDB();
  await wipeDatabase();
  const users = await seedUsers();
  const admin = users.find((u) => u.email === ADMIN_EMAIL);
  const categories = await seedCategories();
  const events = await seedEvents(admin, categories);
  await seedRegistrations(users, events);
  await seedNotifications(users);
  await seedSettings();

  console.log('============================================');
  console.log('   CAMPUSCONNECT SEED COMPLETE');
  console.log('============================================');
  console.log(`   Admin login:  ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`   All other users password:  ${DEMO_PASSWORD}`);
  console.log(`   Pending student (cannot log in): ${PENDING_STUDENT.email}`);
  console.log('============================================');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});