import PlatformSettings from '../models/PlatformSettings.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await PlatformSettings.findOne().sort({ createdAt: -1 });
  if (!settings) {
    settings = await PlatformSettings.create({});
  }
  res.status(200).json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await PlatformSettings.findOne().sort({ createdAt: -1 });
  if (!settings) {
    settings = await PlatformSettings.create({});
  }

  const allowed = [
    'institutionName', 'tagline', 'academicYear', 'currentTerm', 'adminEmail',
    'allowStudentRegistrations', 'requireFacultyApproval', 'enableAutomaticQrPasses',
    'maxConcurrentRegistrationsPerStudent',
  ];

  for (const key of allowed) {
    if (req.body[key] !== undefined) settings[key] = req.body[key];
  }
  await settings.save();

  res.status(200).json({ success: true, message: 'Campus configuration saved successfully.', settings });
});