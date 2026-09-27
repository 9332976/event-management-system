import mongoose from 'mongoose';

const platformSettingsSchema = new mongoose.Schema(
  {
    institutionName: { type: String, default: 'National Institute of Technology & Campus Excellence' },
    tagline: { type: String, default: 'Discover. Participate. Connect.' },
    academicYear: { type: String, default: '2026 - 2027' },
    currentTerm: { type: String, default: 'Autumn Semester' },
    adminEmail: { type: String, default: 'dean.studentaffairs@campus.edu' },
    allowStudentRegistrations: { type: Boolean, default: true },
    requireFacultyApproval: { type: Boolean, default: true },
    enableAutomaticQrPasses: { type: Boolean, default: true },
    maxConcurrentRegistrationsPerStudent: { type: Number, default: 8 },
  },
  { timestamps: true }
);

export default mongoose.model('PlatformSettings', platformSettingsSchema);