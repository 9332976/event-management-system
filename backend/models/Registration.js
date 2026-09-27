import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventTitle: { type: String, default: '' },
    category: { type: String, default: '' },
    eventDate: { type: String, default: '' },
    eventTime: { type: String, default: '' },
    venue: { type: String, default: '' },
    banner: { type: String, default: '' },
    studentName: { type: String, default: '' },
    studentEmail: { type: String, default: '' },
    studentId: { type: String, default: '' },
    department: { type: String, default: '' },
    ticketTier: { type: String, default: 'VIP All-Access Pass' },
    seating: { type: String, default: '' },
    dietary: { type: String, default: '' },
    specialRequirements: { type: String, default: '' },
    discountCode: { type: String, default: null },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectReason: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    amountPaid: { type: Number, default: 0 },
    paidAt: { type: Date, default: null },
    paymentMethod: { type: String, default: '' },
    attendance: {
      type: String,
      enum: ['Pending', 'Present', 'Absent'],
      default: 'Pending',
    },
    teamName: { type: String, default: 'Solo Participant' },
    teamMembers: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

registrationSchema.virtual('id').get(function () {
  return this._id.toString();
});

registrationSchema.index({ user: 1, event: 1 });
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ paymentStatus: 1 });
registrationSchema.index({ status: 1, appliedAt: -1 });

export default mongoose.model('Registration', registrationSchema);