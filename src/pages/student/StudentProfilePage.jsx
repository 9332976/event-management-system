import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Hash,
  Sparkles,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const StudentProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Debjit Banerjee',
    email: currentUser?.email || 'debjit.banerjee@campus.edu',
    studentId: currentUser?.studentId || '2023-CS-084',
    department: currentUser?.department || 'Computer Science & Engineering',
    year: currentUser?.year || '3rd Year',
    phone: currentUser?.phone || '+91 98765 43210',
    bio: currentUser?.bio || 'Passionate full-stack developer & competitive programmer.',
    skills: currentUser?.skills || ['React', 'Python', 'AI/ML', 'Design'],
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    showToast('Profile details updated successfully!', 'success');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            
            {/* Avatar */}
            <div className="relative group">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center text-white text-xs font-semibold">
                  <Camera className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {formData.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {currentUser?.role || 'Student'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {formData.studentId} • {formData.department}
              </p>
              <p className="text-xs text-slate-400">
                Member since {currentUser?.joinedDate || 'August 2023'}
              </p>
            </div>
          </div>

          {/* Edit / Cancel Toggle Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isEditing
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Avatar Selector in Edit Mode */}
        {isEditing && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Avatar:
            </p>
            <div className="flex items-center gap-3">
              {avatarOptions.map((av, idx) => (
                <img
                  key={idx}
                  src={av}
                  alt="avatar option"
                  onClick={() => setFormData({ ...formData, avatar: av })}
                  className={`w-12 h-12 rounded-2xl object-cover cursor-pointer ring-2 transition-transform hover:scale-105 ${
                    formData.avatar === av ? 'ring-indigo-600 scale-105' : 'ring-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Main Details Form / View */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
        
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Academic & Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                {formData.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              College Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                {formData.email}
              </p>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Student ID / Roll
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                {formData.studentId}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                {formData.phone}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                {formData.department}
              </p>
            )}
          </div>

          {/* Current Year */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Year of Study
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                {formData.year}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            Student Bio
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl leading-relaxed">
              {formData.bio}
            </p>
          )}
        </div>

        {/* Skills & Interests Tags */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
            Skills & Co-curricular Interests
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {formData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-2 max-w-sm">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Flutter, Debate)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        )}

      </form>

    </div>
  );
};
