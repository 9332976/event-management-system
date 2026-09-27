import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Category from '../models/Category.js';
import PlatformSettings from '../models/PlatformSettings.js';
import Notification from '../models/Notification.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { slugify } from '../utils/helpers.js';

export const getAllEvents = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    date,
    type,
    approvalStatus,
    featured,
    page = 1,
    limit = 20,
    sort = '-createdAt',
  } = req.query;

  const filter = {};

  if (category && category !== 'all') filter.category = category;

  if (approvalStatus && approvalStatus !== 'all') {
    filter.approvalStatus = approvalStatus;
  }

  if (featured === 'true') filter.isFeatured = true;
  if (type && type !== 'all') filter.type = type;
  if (date) filter.date = date;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { venue: { $regex: search, $options: 'i' } },
      { 'organizer.name': { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [events, total] = await Promise.all([
    Event.find(filter).skip(skip).limit(parseInt(limit)).sort(sort),
    Event.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    events,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let event;

  if (mongoose.Types.ObjectId.isValid(id)) {
    event = await Event.findById(id);
    if (!event) event = await Event.findOne({ slug: id });
  } else {
    event = await Event.findOne({ slug: id });
  }

  if (!event) throw new ApiError(404, 'Event not found.');

  res.status(200).json({ success: true, event });
});

export const getRecommendedEvents = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Please log in.');
  const registered = await Registration.find({ user: req.user._id }).select('event');
  const registeredIds = registered.map((r) => r.event);
  const events = await Event.find({ _id: { $nin: registeredIds } })
    .limit(6)
    .sort({ date: 1 });
  res.status(200).json({ success: true, events });
});

export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    description,
    date,
    time,
    endTime,
    venue,
    type,
    maxParticipants,
    price,
    priceAmount,
    banner,
    department,
    eligibility,
    rules,
    tags,
    prizes,
    schedule,
    registrationDeadline,
    isFeatured,
  } = req.body;

  if (!title || !category || !date) {
    throw new ApiError(400, 'Title, category, and date are required.');
  }

  const catObj = await Category.findOne({ slug: category });
  const slug = slugify(title);

  const existingSlug = await Event.findOne({ slug });
  if (existingSlug) {
    req.body.slugUnique = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const event = await Event.create({
    title,
    slug: req.body.slugUnique || slug,
    category,
    categoryLabel: catObj?.name || category.charAt(0).toUpperCase() + category.slice(1),
    description: description || '',
    date,
    formattedDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: time || '10:00 AM',
    endTime: endTime || '04:00 PM',
    venue: venue || 'Campus Central Auditorium',
    type: type || 'Offline',
    maxParticipants: Number(maxParticipants) || 100,
    registeredCount: 0,
    seatsLeft: Number(maxParticipants) || 100,
    status: 'Available',
    approvalStatus: 'Approved',
    registrationDeadline: registrationDeadline || date,
    isFeatured: isFeatured || false,
    price: price || 'Free',
    priceAmount: Number(priceAmount) || 0,
    tags: tags || ['Campus', 'Event'],
    prizes: prizes || 'Certificates & Mementos',
    eligibility: eligibility || 'Open to all enrolled students.',
    rules: rules && rules.length > 0 ? rules : ['College ID card is mandatory.', 'Follow campus conduct regulations.'],
    schedule: schedule && schedule.length > 0 ? schedule : [{ time: time || '10:00 AM', title: 'Registration & Inauguration', desc: 'Opening address.' }],
    department: department || 'Engineering',
    organizer: {
      name: req.user.name,
      club: department || 'Campus Department',
      avatar: req.user.avatar || '',
      email: req.user.email,
      phone: req.user.phone || '',
    },
    organizerUser: req.user._id,
  });

  await Category.updateOne({ slug: category }, { $inc: { count: 1 } });

  res.status(201).json({
    success: true,
    message: `Event "${event.title}" published successfully!`,
    event,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found.');

  const allowed = [
    'title', 'description', 'date', 'time', 'endTime', 'venue', 'type',
    'maxParticipants', 'price', 'priceAmount', 'banner', 'department', 'eligibility', 'rules',
    'tags', 'prizes', 'schedule', 'registrationDeadline', 'isFeatured',
  ];

  const body = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) body[key] = req.body[key];
  }
  if (body.priceAmount !== undefined) body.priceAmount = Number(body.priceAmount) || 0;
  if (body.maxParticipants !== undefined) {
    const max = Number(body.maxParticipants) || 0;
    body.maxParticipants = max;
    body.seatsLeft = Math.max(0, max - (event.registeredCount || 0));
  }

  if (body.title) {
    body.slug = slugify(body.title) + (await Event.countDocuments({ _id: { $ne: event._id }, slug: slugify(body.title) }) ? `-${Date.now().toString().slice(-4)}` : '');
  }

  const updated = await Event.findByIdAndUpdate(event._id, body, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Event updated successfully.', event: updated });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found.');

  await event.deleteOne();
  await Registration.deleteMany({ event: event._id });
  await Category.updateOne({ slug: event.category }, { $inc: { count: -1 } });

  res.status(200).json({ success: true, message: `Event "${event.title}" deleted.` });
});

export const getEventRegistrations = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found.');

  const registrations = await Registration.find({ event: eventId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, registrations });
});

export const getEventAttendees = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found.');

  const registrations = await Registration.find({ event: eventId, status: { $ne: 'Cancelled' } }).sort({ createdAt: -1 });

  const attendees = registrations.map((r) => ({
    id: r._id.toString(),
    registrationId: r.registrationId,
    eventId,
    studentName: r.studentName,
    studentId: r.studentId,
    department: r.department,
    registeredDate: r.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: r.status === 'Confirmed' ? 'Approved' : r.status,
    attendance: r.attendance,
  }));

  res.status(200).json({ success: true, attendees });
});

export const getFeaturedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ approvalStatus: 'Approved', isFeatured: true })
    .sort({ date: 1 })
    .limit(6);
  res.status(200).json({ success: true, events });
});

export const getRecentEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ approvalStatus: 'Approved' }).sort({ date: 1 }).limit(4);
  res.status(200).json({ success: true, events });
});