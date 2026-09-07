import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { EventsPage } from './pages/public/EventsPage';
import { EventDetailsPage } from './pages/public/EventDetailsPage';
import { CalendarPage } from './pages/public/CalendarPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Shared Logistics Pages
import { VenuesPage } from './pages/organizer/VenuesPage';
import { SponsorsPage } from './pages/organizer/SponsorsPage';
import { CollaborationPage } from './pages/organizer/CollaborationPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyRegistrationsPage } from './pages/student/MyRegistrationsPage';
import { BookmarksPage } from './pages/student/BookmarksPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Organizer Pages
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { MyEventsPage } from './pages/organizer/MyEventsPage';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { EditEventPage } from './pages/organizer/EditEventPage';
import { ParticipantsPage } from './pages/organizer/ParticipantsPage';
import { AttendancePage } from './pages/organizer/AttendancePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { useAuth } from './context/AuthContext';

// Protected Route: Only Admin can access
const AdminRoute = () => {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Protected Route: Authenticated Student/User
const StudentRoute = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <EventProvider>
            <BrowserRouter>
              <Routes>
                
                {/* Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/venues" element={<VenuesPage />} />
                  <Route path="/sponsors" element={<SponsorsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Student Portal Routes (Authenticated Students) */}
                <Route element={<StudentRoute />}>
                  <Route path="/student" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/student/dashboard" replace />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="registrations" element={<MyRegistrationsPage />} />
                    <Route path="bookmarks" element={<BookmarksPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="profile" element={<StudentProfilePage />} />
                  </Route>
                </Route>

                {/* Organizer Portal Routes */}
                <Route path="/organizer" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/organizer/dashboard" replace />} />
                  <Route path="dashboard" element={<OrganizerDashboard />} />
                  <Route path="events" element={<MyEventsPage />} />
                  <Route path="create-event" element={<CreateEventPage />} />
                  <Route path="edit-event/:id" element={<EditEventPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="venues" element={<VenuesPage />} />
                  <Route path="sponsors" element={<SponsorsPage />} />
                  <Route path="collaborate" element={<CollaborationPage />} />
                  <Route path="participants" element={<ParticipantsPage />} />
                  <Route path="attendance" element={<AttendancePage />} />
                </Route>

                {/* Admin Portal Routes (Admin Only) */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="events" element={<AdminEventsPage />} />
                    <Route path="create-event" element={<CreateEventPage />} />
                    <Route path="edit-event/:id" element={<EditEventPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="venues" element={<VenuesPage />} />
                    <Route path="sponsors" element={<SponsorsPage />} />
                    <Route path="registrations" element={<AdminRegistrationsPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>
                </Route>

                {/* Custom 404 Fallback */}
                <Route element={<PublicLayout />}>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

              </Routes>
            </BrowserRouter>
          </EventProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
