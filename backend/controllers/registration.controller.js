import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import PlatformSettings from '../models/PlatformSettings.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { generatePassId, computeEventStatus } from '../utils/helpers.js';

export const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const customDetails = req.body || {};

  const settings = await PlatformSettings.findOne().sort({ createdAt: -1 });
  const maxConcurrent = settings ? settings.maxConcurrentRegistrationsPerStudent : 8;
  const allowRegistrations = settings ? settings.allowStudentRegistrations : true;

  if (!allowRegistrations) {
    throw new ApiError(403, 'Student registrations are currently disabled by the administration.');
  }

  const session = await mongoose.startSession();
  try {
    let result;
    let autoApproved = false;
    await session.withTransaction(async () => {
      // Only a live application (Pending or Approved) blocks a re-apply.
      const existing = await Registration.findOne({
        event: eventId,
        user: req.user._id,
        status: { $in: ['Pending', 'Approved'] },
      }).session(session);
      if (existing) {
        throw new ApiError(
          400,
          existing.status === 'Pending'
            ? 'You already have an application awaiting approval for this event.'
            : 'You are already registered for this event.'
        );
      }

      const currentRegCount = await Registration.countDocuments({
        user: req.user._id,
        status: { $in: ['Pending', 'Approved'] },
      }).session(session);
      if (currentRegCount >= maxConcurrent) {
        throw new ApiError(400, `You have reached the maximum of ${maxConcurrent} concurrent applications.`);
      }

      const event = await Event.findById(eventId).session(session);
      if (!event) throw new ApiError(404, 'Event not found.');
      if (event.approvalStatus !== 'Approved') {
        throw new ApiError(400, 'This event is not yet open for applications.');
      }
      if (event.seatsLeft <= 0) {
        throw new ApiError(400, 'Sorry, this event is already fully booked.');
      }

      // Free events need no payment, so they skip the admin review queue.
      const isFree = !event.priceAmount || event.priceAmount <= 0;
      autoApproved = isFree;
      const now = new Date();
      const regId = generatePassId();

      const registration = await Registration.create(
        [
          {
            registrationId: regId,
            event: event._id,
            user: req.user._id,
            eventTitle: event.title,
            category: event.category,
            eventDate: event.date,
            eventTime: event.time,
            venue: event.venue,
            banner: event.banner,
            studentName: req.user.name,
            studentEmail: req.user.email,
            studentId: req.user.studentId,
            department: req.user.department,
            ticketTier: customDetails.ticketTier || 'VIP All-Access Pass',
            seating: customDetails.seating || 'Section A - Main Auditorium',
            dietary: customDetails.dietary || 'Vegetarian',
            specialRequirements: customDetails.specialRequirements || 'Standard Delegate Kit',
            discountCode: customDetails.discountCode || null,
            status: isFree ? 'Approved' : 'Pending',
            appliedAt: now,
            reviewedAt: isFree ? now : null,
            reviewedBy: isFree ? req.user._id : null,
            paymentStatus: isFree ? 'paid' : 'unpaid',
            amountPaid: event.priceAmount || 0,
            paidAt: isFree ? now : null,
            paymentMethod: isFree ? 'Free Event' : '',
            attendance: 'Pending',
            teamName: customDetails.teamName || 'Solo Participant',
            teamMembers: customDetails.teamMembers && customDetails.teamMembers.length
              ? customDetails.teamMembers
              : [req.user.name],
          },
        ],
        { session }
      );

      // The seat is held as soon as the application is submitted.
      const newCount = event.registeredCount + 1;
      const newSeatsLeft = Math.max(0, event.seatsLeft - 1);
      await Event.updateOne(
        { _id: event._id },
        {
          $set: {
            registeredCount: newCount,
            seatsLeft: newSeatsLeft,
            status: computeEventStatus(newSeatsLeft),
          },
        },
        { session }
      );

      await Notification.create(
        [
          {
            user: req.user._id,
            title: isFree ? 'Enrollment Confirmed!' : 'Application Received',
            message: isFree
              ? `You are enrolled in ${event.title}. Your Ticket Pass: ${regId}`
              : `Your application for ${event.title} is awaiting admin approval. Ticket Pass ID: ${regId}`,
            category: 'registration',
            read: false,
            link: '/student/dashboard',
          },
        ],
        { session }
      );

      result = registration[0];
    });

    await session.endSession();
    res.status(201).json({
      success: true,
      message: autoApproved
        ? `Enrollment successful! Pass ID: ${result.registrationId}`
        : `Application submitted! Pass ID: ${result.registrationId}. Awaiting admin approval.`,
      requiresApproval: !autoApproved,
      registration: result,
    });
  } catch (error) {
    await session.endSession();
    throw error;
  }
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, registrations });
});

export const getOrganizerRoster = asyncHandler(async (req, res) => {
  const eventIds = (await Event.find({}).select('_id')).map((e) => e._id);

  let registrations = [];
  if (eventIds.length > 0) {
    // The check-in roster only contains students who actually hold a ticket.
    registrations = await Registration.find({
      event: { $in: eventIds },
      status: 'Approved',
    }).sort({ createdAt: -1 }).limit(500);
  }

  const attendees = registrations.map((r) => ({
    id: r._id.toString(),
    registrationId: r.registrationId,
    eventId: r.event.toString(),
    eventTitle: r.eventTitle,
    studentName: r.studentName,
    studentId: r.studentId,
    department: r.department,
    registeredDate: r.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: r.status,
    attendance: r.attendance,
    paymentStatus: r.paymentStatus,
  }));

  res.status(200).json({ success: true, attendees });
});

export const getAllRegistrations = asyncHandler(async (req, res) => {
  const { search, event, status, page = 1, limit = 100 } = req.query;
  const filter = {};
  if (event) filter.event = event;
  if (status && status !== 'all') {
    if (!['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(status)) {
      throw new ApiError(400, 'Status must be Pending, Approved, Rejected or Cancelled.');
    }
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { studentEmail: { $regex: search, $options: 'i' } },
      { registrationId: { $regex: search, $options: 'i' } },
      { eventTitle: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [registrations, total, pendingApplications] = await Promise.all([
    Registration.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    Registration.countDocuments(filter),
    Registration.countDocuments({ status: 'Pending' }),
  ]);

  res.status(200).json({
    success: true,
    registrations,
    pendingApplications,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  });
});

export const getRegistrationByPass = asyncHandler(async (req, res) => {
  const { passId } = req.params;
  const registration = await Registration.findOne({ registrationId: passId }).populate('event', 'title status');
  if (!registration) throw new ApiError(404, 'Pass not found. Please check the pass ID.');
  res.status(200).json({ success: true, registration });
});

export const cancelRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;

  const session = await mongoose.startSession();
  try {
    let cancelled;
    await session.withTransaction(async () => {
      const reg = await Registration.findOne({ registrationId, user: req.user._id }).session(session);
      if (!reg) throw new ApiError(404, 'Application not found.');
      if (reg.status === 'Cancelled') throw new ApiError(400, 'This application is already cancelled.');

      const heldSeat = ['Pending', 'Approved'].includes(reg.status);
      reg.status = 'Cancelled';
      await reg.save({ session });

      // A rejected application already gave its seat back.
      if (heldSeat) await releaseSeat(reg.event, session);
      cancelled = reg;
    });
    await session.endSession();

    res.status(200).json({ success: true, message: 'Application cancelled. Your seat is now free for another student.', registration: cancelled });
  } catch (error) {
    await session.endSession();
    throw error;
  }
});

export const cancelRegistrationAdmin = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;

  const session = await mongoose.startSession();
  try {
    let cancelled;
    await session.withTransaction(async () => {
      const reg = await Registration.findOne({ registrationId }).session(session);
      if (!reg) throw new ApiError(404, 'Application not found.');
      if (reg.status === 'Cancelled') throw new ApiError(400, 'This application is already cancelled.');

      const heldSeat = ['Pending', 'Approved'].includes(reg.status);
      reg.status = 'Cancelled';
      await reg.save({ session });

      if (heldSeat) await releaseSeat(reg.event, session);
      cancelled = reg;
    });
    await session.endSession();

    res.status(200).json({ success: true, message: 'Application cancelled by admin.', registration: cancelled });
  } catch (error) {
    await session.endSession();
    throw error;
  }
});

export const setAttendeeAttendance = asyncHandler(async (req, res) => {
  const { attendance } = req.body;
  if (!['Present', 'Absent', 'Pending'].includes(attendance)) {
    throw new ApiError(400, 'Attendance must be Present, Absent, or Pending.');
  }

  const registration = await Registration.findById(req.params.id);
  if (!registration) throw new ApiError(404, 'Registration not found.');

  registration.attendance = attendance;
  await registration.save();

  if (attendance === 'Present') {
    await Notification.create({
      user: registration.user,
      title: 'Attendance Recorded',
      message: `Your attendance was marked for ${registration.eventTitle}.`,
      category: 'attendance',
      read: false,
      link: '/student/dashboard',
    });
  }

  res.status(200).json({ success: true, message: `Attendance marked as ${attendance}.`, registration });
});

export const scanPass = asyncHandler(async (req, res) => {
  const { registrationId, eventId } = req.body;
  const registration = await Registration.findOne({ registrationId });
  if (!registration) throw new ApiError(404, 'Pass not found. Please check the pass ID.');

  if (eventId && registration.event.toString() !== eventId) {
    throw new ApiError(400, 'Pass does not belong to the selected event.');
  }
  if (registration.status === 'Cancelled') {
    throw new ApiError(400, 'This pass has been cancelled.');
  }

  registration.attendance = 'Present';
  await registration.save();

  await Notification.create({
    user: registration.user,
    title: 'Check-in Successful',
    message: `You checked in to ${registration.eventTitle} successfully.`,
    category: 'attendance',
    read: false,
    link: '/student/dashboard',
  });

  res.status(200).json({
    success: true,
    message: `Check-in successful for ${registration.studentName}!`,
    registration,
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, amountPaid, paymentMethod } = req.body;

  if (!['paid', 'unpaid'].includes(paymentStatus)) {
    throw new ApiError(400, 'Payment status must be paid or unpaid.');
  }

  const registration = await Registration.findOne({ registrationId: req.params.registrationId });
  if (!registration) throw new ApiError(404, 'Registration not found.');

  const amount = amountPaid === undefined ? registration.amountPaid || 0 : Number(amountPaid);
  if (Number.isNaN(amount) || amount < 0) {
    throw new ApiError(400, 'Amount paid must be a positive number.');
  }

  registration.paymentStatus = paymentStatus;
  registration.amountPaid = amount;
  registration.paymentMethod = paymentMethod || registration.paymentMethod || '';
  registration.paidAt = paymentStatus === 'paid' ? new Date() : null;
  await registration.save();

  await Notification.create({
    user: registration.user,
    title: paymentStatus === 'paid' ? 'Payment confirmed' : 'Payment marked as pending',
    message:
      paymentStatus === 'paid'
        ? `Payment of Rs.${amount} received for ${registration.eventTitle}. Your ticket is now active.`
        : `Your payment for ${registration.eventTitle} was reset to unpaid.`,
    category: 'registration',
    read: false,
    link: '/student/dashboard',
  });

  res.status(200).json({
    success: true,
    message: `Payment marked as ${paymentStatus}.`,
    registration,
  });
});

const releaseSeat = async (eventId, session) => {
  const event = await Event.findById(eventId).session(session);
  if (!event) return;
  const cap = Number.isFinite(event.maxParticipants) ? event.maxParticipants : Infinity;
  const newSeats = Math.min(cap, event.seatsLeft + 1);
  await Event.updateOne(
    { _id: event._id },
    {
      $set: {
        seatsLeft: newSeats,
        registeredCount: Math.max(0, event.registeredCount - 1),
        status: computeEventStatus(newSeats),
      },
    },
    { session }
  );
};

export const reviewRegistration = asyncHandler(async (req, res) => {
  const { decision, reason, paymentStatus, amountPaid, paymentMethod } = req.body;

  if (!['approve', 'reject'].includes(decision)) {
    throw new ApiError(400, "Decision must be 'approve' or 'reject'.");
  }
  if (decision === 'reject' && !reason) {
    throw new ApiError(400, 'A reason is required when rejecting an application.');
  }
  if (paymentStatus !== undefined && !['paid', 'unpaid'].includes(paymentStatus)) {
    throw new ApiError(400, 'Payment status must be paid or unpaid.');
  }
  const amount = amountPaid === undefined ? undefined : Number(amountPaid);
  if (amount !== undefined && (Number.isNaN(amount) || amount < 0)) {
    throw new ApiError(400, 'Amount paid must be a positive number.');
  }

  const session = await mongoose.startSession();
  try {
    let updated;
    let released = false;
    await session.withTransaction(async () => {
      const reg = await Registration.findOne({ registrationId: req.params.registrationId }).session(session);
      if (!reg) throw new ApiError(404, 'Registration not found.');
      if (reg.status !== 'Pending') {
        throw new ApiError(
          400,
          `Only applications awaiting review can be actioned (this one is ${reg.status}).`
        );
      }

      reg.reviewedAt = new Date();
      reg.reviewedBy = req.user._id;

      if (decision === 'approve') {
        reg.status = 'Approved';
        reg.rejectReason = '';
        if (paymentStatus !== undefined) reg.paymentStatus = paymentStatus;
        if (amount !== undefined) reg.amountPaid = amount;
        if (paymentMethod) reg.paymentMethod = paymentMethod;
        if (reg.paymentStatus === 'paid' && !reg.paidAt) reg.paidAt = new Date();
        if (reg.paymentStatus === 'unpaid') reg.paidAt = null;
      } else {
        reg.status = 'Rejected';
        reg.rejectReason = reason;
        // A rejected application gives its held seat back to the event.
        released = true;
      }

      await reg.save({ session });
      if (decision === 'reject') await releaseSeat(reg.event, session);
      updated = reg;
    });
    await session.endSession();

    if (decision === 'approve') {
      const ticketReady = updated.status === 'Approved' && updated.paymentStatus === 'paid';
      await Notification.create({
        user: updated.user,
        title: 'Application Approved',
        message: ticketReady
          ? `Your application for ${updated.eventTitle} is approved and paid. Your ticket ${updated.registrationId} is ready.`
          : `Your application for ${updated.eventTitle} is approved. Complete your payment of Rs.${updated.amountPaid || 0} to activate your ticket.`,
        category: 'registration',
        read: false,
        link: '/student/dashboard',
      });
    } else {
      await Notification.create({
        user: updated.user,
        title: 'Application Rejected',
        message: `Your application for ${updated.eventTitle} was not approved. Reason: ${reason}`,
        category: 'registration',
        read: false,
        link: '/student/dashboard',
      });
    }

    res.status(200).json({
      success: true,
      message:
        decision === 'approve'
          ? `Application approved. Ticket ${updated.registrationId} issued to ${updated.studentName}.`
          : `Application rejected${released ? ' and the seat was released' : ''}.`,
      registration: updated,
    });
  } catch (error) {
    await session.endSession();
    throw error;
  }
});