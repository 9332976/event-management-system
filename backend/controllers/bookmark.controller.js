import Bookmark from '../models/Bookmark.js';
import Event from '../models/Event.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id }).populate('event');
  const eventIds = bookmarks.filter((b) => b.event).map((b) => b.event._id.toString());
  res.status(200).json({ success: true, bookmarks: eventIds });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found.');

  const existing = await Bookmark.findOne({ user: req.user._id, event: eventId });
  if (existing) {
    await existing.deleteOne();
    return res.status(200).json({ success: true, bookmarked: false, message: 'Event removed from your saved bookmarks.' });
  }

  await Bookmark.create({ user: req.user._id, event: eventId });
  return res.status(201).json({ success: true, bookmarked: true, message: 'Event saved to your bookmarks!' });
});

export const removeBookmark = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const existing = await Bookmark.findOneAndDelete({ user: req.user._id, event: eventId });
  if (!existing) {
    throw new ApiError(404, 'Event is not in your bookmarks.');
  }

  return res.status(200).json({ success: true, bookmarked: false, message: 'Event removed from your saved bookmarks.' });
});