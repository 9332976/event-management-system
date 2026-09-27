import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const shortenDepartment = (name = '') =>
  name
    .replace(/\b(and|&)\b/gi, '')
    .replace(/&/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 22) || 'Unknown';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildMonthlySeries = (registrations) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const series = MONTH_LABELS.map((label, idx) => ({
    month: label,
    registrations: 0,
    present: 0,
    isFuture: currentYear > now.getFullYear() || idx > currentMonth,
  }));

  for (const reg of registrations) {
    const d = reg.createdAt ? new Date(reg.createdAt) : null;
    if (!d || d.getFullYear() !== currentYear) continue;
    const bucket = series[d.getMonth()];
    bucket.registrations += 1;
    if (reg.attendance === 'Present') bucket.present += 1;
  }

  return series;
};

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalStudents, totalEvents, totalRegistrations, pendingApprovals, activeStudents, pendingApplications] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Event.countDocuments(),
      Registration.countDocuments({ status: { $ne: 'Cancelled' } }),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'student', status: 'active' }),
      Registration.countDocuments({ status: 'Pending' }),
    ]);

  const revenueAgg = await Registration.aggregate([
    { $match: { status: 'Approved' } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, { $ifNull: ['$amountPaid', 0] }, 0] },
        },
        totalDue: {
          $sum: { $cond: [{ $ne: ['$paymentStatus', 'paid'] }, { $ifNull: ['$amountPaid', 0] }, 0] },
        },
        paidCount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
        unpaidCount: { $sum: { $cond: [{ $ne: ['$paymentStatus', 'paid'] }, 1, 0] } },
      },
    },
  ]);

  const revenue = revenueAgg[0] || { totalRevenue: 0, totalDue: 0, paidCount: 0, unpaidCount: 0 };

  const recentPayments = await Registration.find({ paymentStatus: 'paid', amountPaid: { $gt: 0 } })
    .sort({ paidAt: -1 })
    .limit(5)
    .select('studentName studentEmail eventTitle amountPaid paidAt registrationId paymentMethod');

  // Applications waiting in the admin review queue.
  const latestApplications = await Registration.find({ status: 'Pending' })
    .sort({ appliedAt: -1 })
    .limit(5)
    .select('studentName studentEmail eventTitle amountPaid appliedAt registrationId paymentStatus');

  const registrations = await Registration.find({ status: { $ne: 'Cancelled' } }).select('createdAt attendance');
  const presentCount = registrations.filter((r) => r.attendance === 'Present').length;
  const attendanceRate = registrations.length > 0 ? ((presentCount / registrations.length) * 100).toFixed(1) : '0';

  const monthlyRegistrations = buildMonthlySeries(registrations);

  const [categoryRows, eventAgg] = await Promise.all([
    Registration.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: '$category', value: { $sum: 1 } } },
    ]),
    Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);

  const categoryNames = {};
  const cats = await Category.find().select('name slug color');
  cats.forEach((c) => (categoryNames[c.slug] = c.name));

  const colors = ['#8B5CF6', '#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4', '#EC4899', '#84CC16'];
  const categoryDistribution = eventAgg.map((e, i) => ({
    name: categoryNames[e._id] || e._id,
    value: e.count,
    color: colors[i % colors.length],
  }));

  const departmentAttendance = await Registration.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: '$department',
        registered: { $sum: 1 },
        present: { $sum: { $cond: [{ $eq: ['$attendance', 'Present'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$attendance', 'Absent'] }, 1, 0] } },
      },
    },
    { $sort: { registered: -1 } },
    { $limit: 8 },
  ]).then((rows) =>
    rows.map((r) => ({
      department: shortenDepartment(r._id || 'Unknown'),
      registered: r.registered,
      present: r.present,
      absent: r.absent,
    }))
  );

  const adminStats = {
    totalUsers,
    totalStudents,
    activeStudents,
    totalEvents,
    totalRegistrations,
    pendingApprovals,
    pendingApplications,
    totalRevenue: revenue.totalRevenue,
    totalDue: revenue.totalDue,
    paidCount: revenue.paidCount,
    unpaidCount: revenue.unpaidCount,
    studentsPaid: await Registration.distinct('user', { paymentStatus: 'paid', status: 'Approved' }).then((u) => u.length),
    activeClubs: cats.length,
    overallAttendanceRate: parseFloat(attendanceRate),
  };

  res.status(200).json({
    success: true,
    analytics: {
      monthlyRegistrations,
      categoryDistribution,
      departmentAttendance,
      adminStats,
      recentPayments,
      latestApplications,
    },
  });
});
