import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user && (user.name === 'Debjit Roy' || user.email === 'debjit.roy@campus.edu')) {
          user.name = 'Debjit Banerjee';
          user.email = 'debjit.banerjee@campus.edu';
          localStorage.setItem('cc_user', JSON.stringify(user));
        }
        return user;
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    // Default visitor is unauthenticated (guest)
    return null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const savedRole = localStorage.getItem('cc_role');
    return savedRole || 'guest';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cc_user', JSON.stringify(currentUser));
      localStorage.setItem('cc_role', currentUser.role || 'student');
      setCurrentRole(currentUser.role || 'student');
    } else {
      localStorage.removeItem('cc_user');
      localStorage.setItem('cc_role', 'guest');
      setCurrentRole('guest');
    }
  }, [currentUser]);

  // Switch demo roles instantly
  const switchRole = (role) => {
    if (role === 'student') {
      const student = mockUsers.find(u => u.role === 'student') || mockUsers[0];
      setCurrentUser(student);
      setCurrentRole('student');
    } else if (role === 'organizer') {
      const organizer = mockUsers.find(u => u.role === 'organizer') || mockUsers[1];
      setCurrentUser(organizer);
      setCurrentRole('organizer');
    } else if (role === 'admin') {
      const admin = mockUsers.find(u => u.role === 'admin') || mockUsers[2];
      setCurrentUser(admin);
      setCurrentRole('admin');
    } else if (role === 'guest') {
      setCurrentUser(null);
      setCurrentRole('guest');
    }
  };

  const login = (email, password, role = 'student') => {
    // Find matching mock user or assign based on role
    const matched = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || 
      mockUsers.find(u => u.role === role) || 
      mockUsers[0];
    
    const userToSet = { ...matched, role };
    setCurrentUser(userToSet);
    setCurrentRole(role);
    return userToSet;
  };

  const register = (formData) => {
    const newUser = {
      id: `usr_student_${Date.now()}`,
      name: formData.name || 'New Student',
      email: formData.email,
      role: 'student',
      studentId: formData.studentId || '2026-CS-999',
      department: formData.department || 'Computer Science & Engineering',
      year: formData.year || '1st Year',
      semester: formData.semester || '1st Semester',
      phone: formData.phone || '+91 99999 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Enthusiastic campus member ready to explore events!',
      skills: ['Student', 'Campus Life'],
      joinedDate: 'August 2026',
      status: 'active'
    };
    setCurrentUser(newUser);
    setCurrentRole('student');
    return newUser;
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('cc_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    localStorage.removeItem('cc_user');
    localStorage.setItem('cc_role', 'guest');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: !!currentUser && currentRole !== 'guest',
        switchRole,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
