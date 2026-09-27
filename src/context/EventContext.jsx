import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const EventContext = createContext();

const relativeTime = (iso) => {
  if (!iso) return 'Just now';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const normalizeNotifications = (list) =>
  (list || []).map((n) => ({ ...n, timestamp: relativeTime(n.createdAt) }));

const normalizeRegistrations = (list) =>
  (list || []).map((r) => ({
    ...r,
    eventId: r.event,
    status: r.status || 'Pending',
    rejectReason: r.rejectReason || '',
  }));

const mapAttendee = (r) => ({
  id: r.registrationId,
  registrationId: r.registrationId,
  eventId: r.eventId,
  eventTitle: r.eventTitle,
  studentName: r.studentName,
  studentId: r.studentId,
  department: r.department,
  registeredDate: r.registeredDate,
  status: r.status,
  attendance: r.attendance,
});

export const EventProvider = ({ children }) => {
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const roleRef = useRef(currentRole);
  const userRef = useRef(currentUser);
  roleRef.current = currentRole;
  userRef.current = currentUser;

  const loadEvents = useCallback(async () => {
    try {
      const role = roleRef.current;
      if (role === 'admin') {
        const data = await api.get('/events?limit=500&approvalStatus=all');
        setEvents(data.events || []);
      } else {
        const data = await api.get('/events?limit=500');
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to load events:', error.message);
    }
  }, []);

  const loadPersonal = useCallback(async () => {
    const role = roleRef.current;
    if (!userRef.current || role === 'guest') {
      setRegistrations([]);
      setNotifications([]);
      setAttendees([]);
      setAnalytics(null);
      return;
    }
    try {
      const tasks = [];
      if (role === 'admin') {
        tasks.push(api.get('/registrations?limit=500').then((d) => setRegistrations(normalizeRegistrations(d.registrations))));
      } else {
        tasks.push(api.get('/registrations/me').then((d) => setRegistrations(normalizeRegistrations(d.registrations))));
      }

      tasks.push(api.get('/notifications').then((d) => setNotifications(normalizeNotifications(d.notifications))));

      if (role === 'admin') {
        tasks.push(api.get('/registrations/organizer-roster').then((d) => setAttendees((d.attendees || []).map(mapAttendee))));
        tasks.push(api.get('/analytics/admin').then((d) => setAnalytics(d.analytics)));
      } else {
        setAttendees([]);
      }

      await Promise.all(tasks);
    } catch (error) {
      console.error('Failed to load personal data:', error.message);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error.message);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadEvents(), loadCategories(), loadPersonal()]);
    setLoading(false);
  }, [loadEvents, loadCategories, loadPersonal]);

  useEffect(() => {
    loadAll();
  }, [currentUser?.id, currentRole, loadAll]);

  // --- Registrations ---
  // Only live applications block a new one. Rejected/cancelled rows stay visible
  // in history but must not prevent the student from applying again.
  const getRegistration = (eventId) =>
    registrations.find((r) => r.eventId === eventId && ['Pending', 'Approved'].includes(r.status));

  const registerForEvent = async (eventId, studentUser, customDetails = {}) => {
    const existing = getRegistration(eventId);
    if (existing) {
      showToast('You have already applied for this event.', 'warning');
      return existing;
    }
    try {
      const data = await api.post(`/registrations/events/${eventId}/register`, customDetails);
      const reg = { ...data.registration, eventId: data.registration.event };
      setRegistrations((prev) => [reg, ...prev]);
      const autoApproved = reg.status === 'Approved';
      setNotifications((prev) => [{
        id: `local-${Date.now()}`,
        title: autoApproved ? 'Registration Confirmed!' : 'Application Submitted',
        message: autoApproved
          ? `You are confirmed for ${reg.eventTitle}. Your Ticket Pass: ${reg.registrationId}`
          : `Your application for ${reg.eventTitle} was sent for review. Application ID: ${reg.registrationId}`,
        timestamp: 'Just now',
        category: 'registration',
        read: false,
        link: '/student/dashboard',
      }, ...prev]);
      showToast(
        autoApproved
          ? `Registration Successful! Pass ID: ${reg.registrationId}`
          : `Application submitted for review. ID: ${reg.registrationId}`,
        'success'
      );
      loadEvents();
      return reg;
    } catch (error) {
      if (error.statusCode === 400 && /already (registered|applied)/i.test(error.message)) {
        const existingReg = getRegistration(eventId);
        if (existingReg) {
          showToast('You have already applied for this event.', 'warning');
          return existingReg;
        }
      }
      if (error.statusCode === 400 && /fully booked/i.test(error.message)) {
        showToast('Sorry, this event is already fully booked.', 'error');
        return null;
      }
      showToast(error.message || 'Registration failed.', 'error');
      return null;
    }
  };

  // --- Application review (Admin) ---
  const reviewRegistration = async (registrationId, decision, reason = '', options = {}) => {
    try {
      const data = await api.patch(`/registrations/${registrationId}/review`, {
        decision,
        rejectReason: decision === 'reject' ? reason : '',
        ...options,
      });
      const reg = data.registration;
      setRegistrations((prev) =>
        prev.map((r) => (r.registrationId === registrationId ? { ...r, ...reg } : r))
      );
      setAttendees((prev) =>
        prev.map((a) => (a.registrationId === registrationId ? { ...a, ...reg } : a))
      );
      showToast(data.message || `Application ${decision === 'approve' ? 'approved' : 'rejected'}.`, 'success');
      loadEvents();
      loadPersonal();
      return reg;
    } catch (error) {
      showToast(error.message || 'Could not review application.', 'error');
      return null;
    }
  };

  const cancelRegistration = async (registrationId) => {
    try {
      const data = await api.delete(`/registrations/${registrationId}`);
      setRegistrations((prev) =>
        prev.map((r) => (r.registrationId === registrationId ? { ...r, status: 'Cancelled' } : r))
      );
      setAttendees((prev) =>
        prev.map((a) => (a.registrationId === registrationId ? { ...a, status: 'Cancelled' } : a))
      );
      showToast(data.message || 'Registration has been successfully cancelled.', 'info');
      loadEvents();
      return data;
    } catch (error) {
      showToast(error.message || 'Could not cancel registration.', 'error');
      return null;
    }
  };

  // --- Events CRUD ---
  const createEvent = async (eventData) => {
    try {
      const data = await api.post('/events', eventData);
      showToast(data.message || `Event "${data.event?.title || ''}" published successfully!`, 'success');
      loadEvents();
      return data.event;
    } catch (error) {
      showToast(error.message || 'Could not create event.', 'error');
      return null;
    }
  };

  const updateEvent = async (eventId, updatedFields) => {
    try {
      const data = await api.patch(`/events/${eventId}`, updatedFields);
      setEvents((prev) => prev.map((e) => (e.id === eventId ? data.event : e)));
      showToast('Event details updated successfully!', 'success');
      return data.event;
    } catch (error) {
      showToast(error.message || 'Could not update event.', 'error');
      return null;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const data = await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToast(data.message || 'Event deleted.', 'info');
      return data;
    } catch (error) {
      showToast(error.message || 'Could not delete event.', 'error');
      return null;
    }
  };

  // --- Payments (Admin) ---
  const setRegistrationPayment = async (registrationId, paymentStatus, extra = {}) => {
    try {
      const data = await api.patch(`/registrations/${registrationId}/payment`, { paymentStatus, ...extra });
      const reg = data.registration;
      setRegistrations((prev) =>
        prev.map((r) => (r.registrationId === registrationId ? { ...r, ...reg } : r))
      );
      showToast(data.message || `Payment marked as ${paymentStatus}.`, 'success');
      loadEvents();
      return reg;
    } catch (error) {
      showToast(error.message || 'Could not update payment.', 'error');
      return null;
    }
  };

  // --- Attendance ---
  const setAttendeeAttendance = async (attendeeId, attendanceStatus) => {
    try {
      const data = await api.patch(`/registrations/${attendeeId}/attendance`, { attendance: attendanceStatus });
      setAttendees((prev) =>
        prev.map((att) => (att.id === attendeeId ? { ...att, attendance: attendanceStatus } : att))
      );
      showToast(`Attendance marked as ${attendanceStatus}.`, 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Could not update attendance.', 'error');
      return null;
    }
  };

  // --- Notifications ---
  const markNotificationRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      console.error('markNotificationRead failed:', error.message);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.patch('/notifications/read-all');
      showToast('All notifications marked as read', 'info');
    } catch (error) {
      console.error('markAllNotificationsRead failed:', error.message);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    try {
      await api.delete('/notifications');
      showToast('Notifications cleared', 'info');
    } catch (error) {
      console.error('clearNotifications failed:', error.message);
    }
  };

  // --- Categories (Admin) ---
  const addCategory = async (categoryData) => {
    try {
      const data = await api.post('/categories', categoryData);
      showToast(data.message || `Category "${data.category?.name || ''}" added successfully!`, 'success');
      await loadCategories();
      return data.category;
    } catch (error) {
      showToast(error.message || 'Could not add category.', 'error');
      return null;
    }
  };

  const updateCategory = async (categorySlug, updates) => {
    try {
      const data = await api.patch(`/categories/${categorySlug}`, updates);
      showToast(data.message || 'Category updated.', 'success');
      await loadCategories();
      return data.category;
    } catch (error) {
      showToast(error.message || 'Could not update category.', 'error');
      return null;
    }
  };

  const deleteCategory = async (categorySlug) => {
    try {
      const data = await api.delete(`/categories/${categorySlug}`);
      setCategories((prev) => prev.filter((c) => c.slug !== categorySlug));
      showToast(data.message || 'Category deleted.', 'info');
      return data;
    } catch (error) {
      showToast(error.message || 'Could not delete category.', 'error');
      return null;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        categories,
        registrations,
        notifications,
        attendees,
        analytics,
        loading,
        getRegistration,
        registerForEvent,
        reviewRegistration,
        cancelRegistration,
        createEvent,
        updateEvent,
        deleteEvent,
        setRegistrationPayment,
        setAttendeeAttendance,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories: loadCategories,
        refresh: loadAll,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};