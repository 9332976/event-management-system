import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

// Student Page (single dashboard)
import { StudentDashboard } from './pages/student/StudentDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { EventFormPage } from './pages/admin/EventFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { useAuth } from './context/AuthContext';

// Protected Route: Admin only
const AdminRoute = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return <Outlet />;
};

// Protected Route: any authenticated active account
const StudentRoute = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
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
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Student Portal (single dashboard) */}
                <Route element={<StudentRoute />}>
                  <Route path="/student" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/student/dashboard" replace />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                  </Route>
                </Route>

                {/* Admin Portal (Admin Only) */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="students" element={<AdminStudentsPage />} />
                    <Route path="events" element={<AdminEventsPage />} />
                    <Route path="events/new" element={<EventFormPage />} />
                    <Route path="events/:id/edit" element={<EventFormPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
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
