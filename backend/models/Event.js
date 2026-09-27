import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    categoryLabel: { type: String, default: '' },
    banner: { type: String, default: '' },
    date: { type: String, required: true },
    formattedDate: { type: String, default: '' },
    time: { type: String, default: '10:00 AM' },
    endTime: { type: String, default: '04:00 PM' },
    venue: { type: String, default: 'Campus Central Auditorium' },
    type: {
      type: String,
      enum: ['Offline', 'Online', 'Hybrid'],
      default: 'Offline',
    },
    organizer: {
      name: { type: String, default: '' },
      club: { type: String, default: '' },
      avatar: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    organizerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    department: { type: String, default: '' },
    maxParticipants: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 0 },
    seatsLeft: { type: Number, default: 100 },
    status: { type: String, default: 'Available' },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved',
    },
    registrationDeadline: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    price: { type: String, default: 'Free' },
    priceAmount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    prizes: { type: String, default: '' },
    description: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    rules: { type: [String], default: [] },
    schedule: [
      {
        time: { type: String },
        title: { type: String },
        desc: { type: String },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

eventSchema.virtual('id').get(function () {
  return this._id.toString();
});

eventSchema.index({ approvalStatus: 1, date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizerUser: 1 });
eventSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Event', eventSchema);