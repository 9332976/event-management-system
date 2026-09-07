import React, { useState } from 'react';
import { mockCollaborationTasks, mockLiveAnnouncements } from '../../data/mockCollaboration';
import { useToast } from '../../context/ToastContext';
import {
  CheckSquare,
  Sparkles,
  Plus,
  Bell,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Share2,
  FileText,
  Radio,
  Send
} from 'lucide-react';

export const CollaborationPage = () => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState(mockCollaborationTasks);
  const [announcements, setAnnouncements] = useState(mockLiveAnnouncements);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: 'Prof. Ananya Sharma',
    priority: 'High',
    dueDate: '2026-09-15',
    department: 'CSE Tech Guild'
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    type: 'Urgent',
    message: ''
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    const taskObj = {
      id: `tsk-${Date.now()}`,
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      assignedRole: 'Coordinator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: newTask.priority,
      status: 'Pending',
      dueDate: newTask.dueDate,
      department: newTask.department
    };
    setTasks([taskObj, ...tasks]);
    showToast('Task added to planning board!', 'success');
    setTaskModalOpen(false);
    setNewTask({
      title: '',
      assignedTo: 'Prof. Ananya Sharma',
      priority: 'High',
      dueDate: '2026-09-15',
      department: 'CSE Tech Guild'
    });
  };

  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    const annObj = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      timestamp: 'Just now',
      type: newAnnouncement.type,
      message: newAnnouncement.message
    };
    setAnnouncements([annObj, ...announcements]);
    showToast('Live announcement broadcast to all registered attendees!', 'success');
    setAnnouncementModalOpen(false);
    setNewAnnouncement({ title: '', type: 'Urgent', message: '' });
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : t.status === 'Pending' ? 'In Progress' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    showToast('Task status updated!', 'info');
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Event Team Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Team Collaboration & Broadcast Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign coordinator duties, track real-time logistics tasks, and broadcast live alerts to attendees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnnouncementModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Broadcast Alert</span>
          </button>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns (Tasks Board & Live Broadcasts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Task Assignment Board (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>Logistics & Operational Tasks ({tasks.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                Click badge to change status
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold ${
                        task.status === 'Completed'
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {task.department}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-transform hover:scale-105 shrink-0 ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {task.status}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.avatar}
                        alt={task.assignedTo}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{task.assignedTo}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Due: {task.dueDate}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Col: Live Announcement Feed & Shared Docs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Announcements Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Live Attendee Broadcasts</span>
              </h3>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {announcements.length} Sent
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200/60 dark:border-rose-900/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 uppercase">
                      {ann.type} Alert
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ann.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Planning Docs & Links */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Shared Event Repositories</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <a
                href="#slack"
                onClick={(e) => { e.preventDefault(); showToast('Opening Slack / Teams integration channel...', 'info'); }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-slate-900 dark:text-white">#event-core-team on Slack</span>
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Connected</span>
              </a>

              <a
                href="#drive"
                onClick={(e) => { e.preventDefault(); showToast('Opening shared drive folder with speaker slides...', 'info'); }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-900 dark:text-white">Speaker Slide Decks & Presentation Assets</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">12 Files</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* New Task Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Operational Task
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign coordinators and set target deadlines.
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect Stage Lighting and Microphone Setup"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Coordinator
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="Prof. Ananya Sharma">Prof. Ananya Sharma (Lead)</option>
                    <option value="Debjit Banerjee">Debjit Banerjee (Student Lead)</option>
                    <option value="Priya Sundaram">Priya Sundaram (Hospitality)</option>
                    <option value="Arjun Nambiar">Arjun Nambiar (DevOps/Network)</option>
                    <option value="Rohan Mukherjee">Rohan Mukherjee (Logistics)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Due Target Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>Broadcast Real-Time Alert</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Push instant notification to all registered attendees' portals and mobile screens.
              </p>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Change: Hackathon Pitch shifted to 4:00 PM"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Type
                </label>
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="Urgent">Urgent (Red Alert)</option>
                  <option value="Schedule Update">Schedule Update (Blue Alert)</option>
                  <option value="Venue Relocation">Venue Relocation (Amber Alert)</option>
                  <option value="General Info">General Announcement</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Details
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide precise location, room number, or schedule adjustment..."
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
