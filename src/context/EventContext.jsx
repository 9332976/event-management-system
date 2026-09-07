import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mockEvents } from '../data/mockEvents';
import { mockCategories } from '../data/mockCategories';
import { mockNotifications } from '../data/mockNotifications';
import { useToast } from './ToastContext';

const EventContext = createContext();

// Sample initial registrations for demo student (Debjit Banerjee)
const initialRegistrations = [
  {
    registrationId: "CC-2026-8F92A",
    eventId: "evt-001",
    eventTitle: "InnovateX 2026: 36-Hour National Hackathon",
    category: "hackathon",
    eventDate: "2026-09-15",
    eventTime: "09:00 AM",
    venue: "Main Auditorium & Computing Lab 4",
    banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    studentName: "Debjit Banerjee",
    studentEmail: "debjit.banerjee@campus.edu",
    studentId: "2023-CS-084",
    department: "Computer Science & Engineering",
    ticketTier: "VIP Hacker Pass",
    seating: "Main Computing Lab - Pod A",
    dietary: "Vegetarian",
    specialRequirements: "Requires 24/7 power point for laptop",
    registeredAt: "2026-08-20T10:30:00Z",
    status: "Confirmed",
    attendance: "Pending",
    teamName: "Neural Innovators",
    teamMembers: ["Debjit Banerjee", "Priya Sundaram", "Arjun Nambiar"]
  },
  {
    registrationId: "CC-2026-3B17K",
    eventId: "evt-003",
    eventTitle: "Applied Generative AI & LLM Systems Workshop",
    category: "workshop",
    eventDate: "2026-09-05",
    eventTime: "10:00 AM",
    venue: "Seminar Hall 2 & Virtual Stream",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    studentName: "Debjit Banerjee",
    studentEmail: "debjit.banerjee@campus.edu",
    studentId: "2023-CS-084",
    department: "Computer Science & Engineering",
    ticketTier: "Masterclass Delegate",
    seating: "Tiered Auditorium Row 2",
    dietary: "Non-Veg",
    specialRequirements: "Pre-provisioned GPU sandbox",
    registeredAt: "2026-08-22T14:15:00Z",
    status: "Confirmed",
    attendance: "Present",
    teamName: "Solo Participant",
    teamMembers: ["Debjit Banerjee"]
  }
];

// Initial mock attendees roster for organizers
const initialAttendees = [
  {
    id: "att-001",
    registrationId: "CC-2026-8F92A",
    eventId: "evt-001",
    studentName: "Debjit Roy",
    studentId: "2023-CS-084",
    department: "Computer Science",
    registeredDate: "Aug 20, 2026",
    status: "Approved",
    attendance: "Present"
  },
  {
    id: "att-002",
    registrationId: "CC-2026-9A101",
    eventId: "evt-001",
    studentName: "Priya Sundaram",
    studentId: "2023-EC-112",
    department: "Electronics",
    registeredDate: "Aug 21, 2026",
    status: "Approved",
    attendance: "Present"
  },
  {
    id: "att-003",
    registrationId: "CC-2026-7B442",
    eventId: "evt-001",
    studentName: "Rohan Mukherjee",
    studentId: "2022-ME-045",
    department: "Mechanical",
    registeredDate: "Aug 22, 2026",
    status: "Approved",
    attendance: "Absent"
  },
  {
    id: "att-004",
    registrationId: "CC-2026-4C590",
    eventId: "evt-001",
    studentName: "Sneha Patel",
    studentId: "2024-BT-029",
    department: "Biotechnology",
    registeredDate: "Aug 23, 2026",
    status: "Approved",
    attendance: "Present"
  },
  {
    id: "att-005",
    registrationId: "CC-2026-2D881",
    eventId: "evt-001",
    studentName: "Arjun Nambiar",
    studentId: "2023-CS-140",
    department: "Computer Science",
    registeredDate: "Aug 24, 2026",
    status: "Approved",
    attendance: "Present"
  },
  {
    id: "att-006",
    registrationId: "CC-2026-5E119",
    eventId: "evt-001",
    studentName: "Kavya Ramesh",
    studentId: "2023-IT-055",
    department: "Information Tech",
    registeredDate: "Aug 24, 2026",
    status: "Pending",
    attendance: "Absent"
  }
];

export const EventProvider = ({ children }) => {
  const { showToast } = useToast();

  // 1. Events State
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('cc_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored events', e);
      }
    }
    return mockEvents;
  });

  // 2. Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('cc_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored categories', e);
      }
    }
    return mockCategories;
  });

  // 3. Registrations State
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('cc_registrations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored registrations', e);
      }
    }
    return initialRegistrations;
  });

  // 4. Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('cc_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored bookmarks', e);
      }
    }
    return ["evt-001", "evt-002", "evt-006"];
  });

  // 5. Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('cc_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored notifications', e);
      }
    }
    return mockNotifications;
  });

  // 6. Attendees State for Organizer Attendance
  const [attendees, setAttendees] = useState(() => {
    const saved = localStorage.getItem('cc_attendees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored attendees', e);
      }
    }
    return initialAttendees;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cc_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cc_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('cc_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('cc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cc_attendees', JSON.stringify(attendees));
  }, [attendees]);

  // Check if an event is bookmarked
  const isBookmarked = (eventId) => bookmarks.includes(eventId);

  // Toggle Bookmark
  const toggleBookmark = (eventId) => {
    setBookmarks((prev) => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast('Event removed from your saved bookmarks', 'info');
        return prev.filter((id) => id !== eventId);
      } else {
        showToast('Event saved to your bookmarks!', 'success');
        return [...prev, eventId];
      }
    });
  };

  // Check if registered
  const getRegistration = (eventId) => {
    return registrations.find((r) => r.eventId === eventId && r.status !== 'Cancelled');
  };

  // Register for event
  const registerForEvent = (eventId, studentUser, customDetails = {}) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return null;

    // Check if already registered
    const existing = getRegistration(eventId);
    if (existing) {
      showToast('You are already registered for this event.', 'warning');
      return existing;
    }

    if (event.seatsLeft <= 0) {
      showToast('Sorry, this event is already fully booked.', 'error');
      return null;
    }

    // Generate unique Pass ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const regId = `CC-2026-${randomHex}`;

    const newReg = {
      registrationId: regId,
      eventId: event.id,
      eventTitle: event.title,
      category: event.category,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      banner: event.banner,
      studentName: studentUser?.name || 'Debjit Banerjee',
      studentEmail: studentUser?.email || 'debjit.banerjee@campus.edu',
      studentId: studentUser?.studentId || '2023-CS-084',
      department: studentUser?.department || 'Computer Science & Engineering',
      ticketTier: customDetails.ticketTier || 'VIP All-Access Pass',
      seating: customDetails.seating || 'Section A - Main Auditorium',
      dietary: customDetails.dietary || 'Vegetarian',
      specialRequirements: customDetails.specialRequirements || 'Standard Delegate Kit',
      discountCode: customDetails.discountCode || null,
      registeredAt: new Date().toISOString(),
      status: 'Confirmed',
      attendance: 'Pending',
      teamName: customDetails.teamName || 'Solo Participant',
      teamMembers: customDetails.teamMembers || [studentUser?.name || 'Debjit Banerjee']
    };

    // Update registration list
    setRegistrations((prev) => [newReg, ...prev]);

    // Decrement seatsLeft and increment registeredCount in event
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const newRegistered = e.registeredCount + 1;
          const newSeatsLeft = Math.max(0, e.seatsLeft - 1);
          let newStatus = e.status;
          if (newSeatsLeft === 0) newStatus = 'Registration Closed';
          else if (newSeatsLeft <= 10) newStatus = 'Almost Full';
          return {
            ...e,
            registeredCount: newRegistered,
            seatsLeft: newSeatsLeft,
            status: newStatus
          };
        }
        return e;
      })
    );

    // Add to attendees list for organizers
    const newAttendee = {
      id: `att-${Date.now()}`,
      registrationId: regId,
      eventId: event.id,
      studentName: studentUser?.name || 'Debjit Roy',
      studentId: studentUser?.studentId || '2023-CS-084',
      department: studentUser?.department || 'Computer Science',
      registeredDate: 'Today',
      status: 'Approved',
      attendance: 'Pending'
    };
    setAttendees((prev) => [newAttendee, ...prev]);

    // Create Notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Registration Confirmed! 🎉',
      message: `You are confirmed for ${event.title}. Ticket Pass: ${regId}`,
      timestamp: 'Just now',
      category: 'registration',
      read: false,
      link: '/student/registrations'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Registration Successful! Pass ID: ${regId}`, 'success');
    return newReg;
  };

  // Cancel Registration
  const cancelRegistration = (registrationId) => {
    const reg = registrations.find((r) => r.registrationId === registrationId);
    if (!reg) return;

    setRegistrations((prev) =>
      prev.map((r) => (r.registrationId === registrationId ? { ...r, status: 'Cancelled' } : r))
    );

    // Free up 1 seat in the event
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === reg.eventId) {
          const newSeats = e.seatsLeft + 1;
          return {
            ...e,
            seatsLeft: newSeats,
            registeredCount: Math.max(0, e.registeredCount - 1),
            status: newSeats > 0 ? (newSeats <= 10 ? 'Almost Full' : 'Available') : e.status
          };
        }
        return e;
      })
    );

    // Remove from active attendees
    setAttendees((prev) =>
      prev.map((a) => (a.registrationId === registrationId ? { ...a, status: 'Cancelled' } : a))
    );

    showToast('Registration has been successfully cancelled.', 'info');
  };

  // Create Event (Organizer / Admin)
  const createEvent = (eventData, organizerUser) => {
    const newId = `evt-${String(events.length + 1).padStart(3, '0')}`;
    const categoryObj = categories.find((c) => c.slug === eventData.category) || categories[0];

    const newEvent = {
      id: newId,
      title: eventData.title,
      slug: eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: eventData.category,
      categoryLabel: categoryObj?.name || 'General',
      banner: eventData.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      date: eventData.date,
      formattedDate: new Date(eventData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: eventData.time || '10:00 AM',
      endTime: eventData.endTime || '04:00 PM',
      venue: eventData.venue || 'Campus Central Auditorium',
      type: eventData.type || 'Offline',
      organizer: {
        name: organizerUser?.name || 'Prof. Ananya Sharma',
        club: eventData.department || 'Campus Department',
        avatar: organizerUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        email: organizerUser?.email || 'organizer@campus.edu',
        phone: organizerUser?.phone || '+91 98123 76540'
      },
      department: eventData.department || 'Engineering',
      maxParticipants: Number(eventData.maxParticipants) || 100,
      registeredCount: 0,
      seatsLeft: Number(eventData.maxParticipants) || 100,
      status: 'Available',
      approvalStatus: 'Approved',
      registrationDeadline: eventData.registrationDeadline || eventData.date,
      isFeatured: eventData.isFeatured || false,
      price: eventData.price || 'Free',
      tags: eventData.tags || ['Campus', 'Event'],
      prizes: eventData.prizes || 'Certificates & Mementos',
      description: eventData.description || 'Exciting college event open to all students.',
      eligibility: eventData.eligibility || 'Open to all enrolled students.',
      rules: eventData.rules && eventData.rules.length > 0 ? eventData.rules : [
        'College ID card is mandatory.',
        'Follow campus conduct regulations.'
      ],
      schedule: eventData.schedule && eventData.schedule.length > 0 ? eventData.schedule : [
        { time: eventData.time || '10:00 AM', title: 'Registration & Inauguration', desc: 'Opening address.' },
        { time: '11:30 AM', title: 'Main Sessions', desc: 'Core activities.' },
        { time: eventData.endTime || '04:00 PM', title: 'Concluding Remarks', desc: 'Certificates distribution.' }
      ]
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Increment count in category
    setCategories((prev) =>
      prev.map((c) => (c.slug === eventData.category ? { ...c, count: (c.count || 0) + 1 } : c))
    );

    showToast(`Event "${newEvent.title}" published successfully!`, 'success');
    return newEvent;
  };

  // Update Event
  const updateEvent = (eventId, updatedFields) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return { ...e, ...updatedFields };
        }
        return e;
      })
    );
    showToast('Event details updated successfully!', 'success');
  };

  // Delete Event
  const deleteEvent = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setBookmarks((prev) => prev.filter((id) => id !== eventId));
    showToast(`Event "${event?.title || eventId}" deleted.`, 'info');
  };

  // Mark Attendance (Present / Absent)
  const setAttendeeAttendance = (attendeeId, attendanceStatus) => {
    setAttendees((prev) =>
      prev.map((att) => (att.id === attendeeId ? { ...att, attendance: attendanceStatus } : att))
    );
    showToast(`Attendance marked as ${attendanceStatus}.`, 'success');
  };

  // Notification Operations
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  // Category Operations (Admin)
  const addCategory = (categoryData) => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id: slug,
      slug,
      name: categoryData.name,
      description: categoryData.description || 'Campus event category.',
      icon: categoryData.icon || 'Sparkles',
      color: categoryData.color || 'from-indigo-500 to-purple-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      count: 0
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully!`, 'success');
  };

  const deleteCategory = (categorySlug) => {
    setCategories((prev) => prev.filter((c) => c.slug !== categorySlug));
    showToast('Category deleted.', 'info');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        categories,
        registrations,
        bookmarks,
        notifications,
        attendees,
        isBookmarked,
        toggleBookmark,
        getRegistration,
        registerForEvent,
        cancelRegistration,
        createEvent,
        updateEvent,
        deleteEvent,
        setAttendeeAttendance,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addCategory,
        deleteCategory,
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
