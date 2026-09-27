import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Bookmark from '../models/Bookmark.js';
import Notification from '../models/Notification.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'studentId', 'department', 'year', 'semester', 'phone', 'avatar', 'bio', 'skills'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found.');
  res.status(200).json({ success: true, user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, status, payment, page = 1, limit = 50 } = req.query;
  const match = {};
  if (role && role !== 'all') match.role = role;
  if (status && status !== 'all') match.status = status;
  if (search) {
    const rx = { $regex: search, $options: 'i' };
    match.$or = [{ name: rx }, { email: rx }, { department: rx }, { studentId: rx }];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'registrations',
        localField: '_id',
        foreignField: 'user',
        as: 'regs',
      },
    },
    // A live application is one still holding a seat: Pending or Approved.
    { $addFields: { liveRegs: { $filter: { input: '$regs', as: 'r', cond: { $in: ['$$r.status', ['Pending', 'Approved']] } } } } },
    { $addFields: { approvedRegs: { $filter: { input: '$liveRegs', as: 'r', cond: { $eq: ['$$r.status', 'Approved'] } } } } },
    {
      $addFields: {
        pendingCount: {
          $size: {
            $filter: { input: '$liveRegs', as: 'r', cond: { $eq: ['$$r.status', 'Pending'] } },
          },
        },
        approvedCount: {
          $size: { $filter: { input: '$approvedRegs', as: 'r', cond: { $eq: ['$$r.status', 'Approved'] } } },
        },
        paidCount: {
          $size: {
            $filter: { input: '$approvedRegs', as: 'r', cond: { $eq: ['$$r.paymentStatus', 'paid'] } },
          },
        },
        unpaidCount: {
          $size: {
            $filter: { input: '$approvedRegs', as: 'r', cond: { $ne: ['$$r.paymentStatus', 'paid'] } },
          },
        },
        totalPaid: {
          $sum: {
            $map: {
              input: {
                $filter: { input: '$approvedRegs', as: 'r', cond: { $eq: ['$$r.paymentStatus', 'paid'] } },
              },
              as: 'r',
              in: { $ifNull: ['$$r.amountPaid', 0] },
            },
          },
        },
        totalDue: {
          $sum: {
            $map: {
              input: {
                $filter: { input: '$approvedRegs', as: 'r', cond: { $ne: ['$$r.paymentStatus', 'paid'] } },
              },
              as: 'r',
              in: { $ifNull: ['$$r.amountPaid', 0] },
            },
          },
        },
        enrolledEvents: {
          $map: {
            input: '$liveRegs',
            as: 'r',
            in: {
              id: { $toString: '$$r._id' },
              registrationId: '$$r.registrationId',
              eventId: { $toString: '$$r.event' },
              eventTitle: '$$r.eventTitle',
              eventDate: '$$r.eventDate',
              eventTime: '$$r.eventTime',
              venue: '$$r.venue',
              status: '$$r.status',
              paymentStatus: { $ifNull: ['$$r.paymentStatus', 'unpaid'] },
              amountPaid: { $ifNull: ['$$r.amountPaid', 0] },
            },
          },
        },
      },
    },
    { $project: { regs: 0, liveRegs: 0, approvedRegs: 0, password: 0 } },
    ...(payment === 'paid'
      ? [{ $match: { paidCount: { $gt: 0 } } }]
      : payment === 'unpaid'
        ? [{ $match: { unpaidCount: { $gt: 0 } } }]
        : payment === 'partial'
          ? [{ $match: { paidCount: { $gt: 0 }, unpaidCount: { $gt: 0 } } }]
          : payment === 'free'
            ? [{ $match: { unpaidCount: 0 } }]
            : []),
    {
      $facet: {
        rows: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: parseInt(limit) },
          { $addFields: { id: { $toString: '$_id' } } },
        ],
        total: [{ $count: 'value' }],
      },
    },
  ];

  const [result] = await User.aggregate(pipeline);
  const rows = result?.rows || [];
  const total = result?.total?.[0]?.value || 0;

  res.status(200).json({
    success: true,
    users: rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  res.status(200).json({ success: true, user });
});

export const getUser360 = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');

  const [registrations, bookmarks, notifications, unreadNotifications, eventsCreated] = await Promise.all([
    Registration.find({ user: user._id }).sort({ createdAt: -1 }),
    Bookmark.find({ user: user._id })
      .populate('event', 'title slug category categoryLabel date formattedDate time venue banner status')
      .sort({ createdAt: -1 }),
    Notification.find({ user: user._id }).sort({ createdAt: -1 }).limit(15),
    Notification.countDocuments({ user: user._id, read: false }),
    Event.countDocuments({ organizerUser: user._id }),
  ]);

  const countBy = (field, value) => registrations.filter((r) => r[field] === value).length;
  const teamNames = registrations
    .map((r) => r.teamName)
    .filter((name) => name && name !== 'Solo Participant');
  const departments = new Set(registrations.map((r) => r.department).filter(Boolean));

  res.status(200).json({
    success: true,
    user,
    registrations,
      bookmarks: bookmarks.map((b) => ({ id: b._id, savedAt: b.createdAt, event: b.event })),
    notifications,
    stats: {
      totalRegistrations: registrations.length,
      confirmed: countBy('status', 'Confirmed'),
      cancelled: countBy('status', 'Cancelled'),
      attended: countBy('attendance', 'Present'),
      absent: countBy('attendance', 'Absent'),
      pendingAttendance: countBy('attendance', 'Pending'),
      paidCount: countBy('paymentStatus', 'paid'),
      unpaidCount: countBy('paymentStatus', 'unpaid'),
      totalPaid: registrations.reduce((sum, r) => sum + (r.amountPaid || 0), 0),
      bookmarks: bookmarks.length,
      unreadNotifications,
      eventsCreated,
      teams: new Set(teamNames).size,
      departmentsRepresented: departments.size,
    },
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'active', 'deactivated'].includes(status)) {
    throw new ApiError(400, 'Status must be pending, active or deactivated.');
  }
  if (req.params.id === req.user._id) {
    throw new ApiError(400, 'You cannot change your own status.');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  if (user.role === 'admin' && status !== 'active') {
    throw new ApiError(400, 'Other admin accounts cannot be suspended.');
  }

  const wasApproved = user.status === 'active';
  user.status = status;
  user.approvedAt = status === 'active' ? user.approvedAt || new Date() : user.approvedAt;
  await user.save();

  if (!wasApproved && status === 'active') {
    await Notification.create({
      user: user._id,
      title: 'Your account has been approved',
      message: 'Welcome to CampusConnect! You can now sign in and explore campus events.',
      category: 'system',
      read: false,
      link: '/login',
    });
  } else if (wasApproved && status === 'deactivated') {
    await Notification.create({
      user: user._id,
      title: 'Your account has been deactivated',
      message: 'Please contact the campus administration to restore access.',
      category: 'system',
      read: false,
      link: '/login',
    });
  }

  res.status(200).json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  res.status(200).json({ success: true, message: `User "${user.name}" deleted.` });
});