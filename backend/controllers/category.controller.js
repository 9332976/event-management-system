import Category from '../models/Category.js';
import Event from '../models/Event.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  // Report how many events use each category so the admin UI can warn before deleting.
  const counts = await Event.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const countMap = counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {});

  const result = categories.map((c) => {
    const obj = c.toJSON();
    obj.eventCount = countMap[c.slug] || 0;
    return obj;
  });

  res.status(200).json({ success: true, categories: result });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color } = req.body;
  if (!name) throw new ApiError(400, 'Category name is required.');

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(400, 'A category with this name already exists.');

  const category = await Category.create({
    name,
    slug,
    description: description || 'Campus event category.',
    icon: icon || 'Sparkles',
    color: color || 'from-indigo-500 to-purple-600',
    count: 0,
  });

  res.status(201).json({ success: true, message: `Category "${name}" added successfully!`, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, description, icon, color, badgeBg } = req.body;

  const category = await Category.findOne({ slug });
  if (!category) throw new ApiError(404, 'Category not found.');

  if (name && name.trim() && name.trim() !== category.name) {
    const nextName = name.trim();
    const nextSlug = nextName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const clash = await Category.findOne({ slug: nextSlug });
    if (clash && clash.slug !== category.slug) {
      throw new ApiError(400, 'A category with this name already exists.');
    }
    category.name = nextName;
    // The slug is intentionally left untouched so existing events keep their link.
  }

  if (description !== undefined) category.description = description;
  if (icon) category.icon = icon;
  if (color) category.color = color;
  if (badgeBg) category.badgeBg = badgeBg;

  await category.save();

  res.status(200).json({ success: true, message: `Category "${category.name}" updated.`, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  if (!category) throw new ApiError(404, 'Category not found.');

  const inUse = await Event.countDocuments({ category: slug });
  if (inUse > 0) {
    throw new ApiError(409, `"${category.name}" is used by ${inUse} event(s). Move those events to another category first.`);
  }

  await category.deleteOne();
  res.status(200).json({ success: true, message: `Category "${category.name}" deleted.` });
});