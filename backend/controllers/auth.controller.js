import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import Notification from '../models/Notification.js';
import Bookmark from '../models/Bookmark.js';
import Registration from '../models/Registration.js';

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);
  const userData = user.toObject();
  delete userData.password;
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userData,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, studentId, department, year, semester, phone, avatar } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required.');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(400, 'An account with this email already exists.');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    studentId: studentId || '',
    department: department || 'Computer Science & Engineering',
    year: year || '1st Year',
    semester: semester || '1st Semester',
    phone: phone || '',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Enthusiastic campus member ready to explore events!',
    skills: ['Student', 'Campus Life'],
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    role: 'student',
    status: 'pending',
  });

  await Notification.create({
    user: user._id,
    title: 'Account submitted for approval',
    message: 'Your registration is with the admin team. You will be able to sign in once your account is approved.',
    category: 'system',
    read: false,
    link: '/login',
  });

  // Let every admin know there is a signup waiting for review.
  const admins = await User.find({ role: 'admin' }).select('_id');
  if (admins.length) {
    await Notification.insertMany(
      admins.map((admin) => ({
        user: admin._id,
        title: 'New student awaiting approval',
        message: `${user.name} (${user.email}) just signed up and needs approval.`,
        category: 'system',
        read: false,
        link: '/admin/students',
      })),
    );
  }

  res.status(201).json({
    success: true,
    message: 'Registration submitted. Your account is pending admin approval.',
    requiresApproval: true,
    user: { id: user.id, name: user.name, email: user.email, status: user.status },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }
  if (user.status === 'deactivated') {
    throw new ApiError(403, 'Your account has been deactivated. Please contact the admin.');
  }
  if (user.status === 'pending') {
    throw new ApiError(403, 'Your account is awaiting admin approval. You will be able to sign in once it is approved.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
