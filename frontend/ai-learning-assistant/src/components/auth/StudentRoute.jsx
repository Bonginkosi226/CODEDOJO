import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Guard for student-only pages (dashboard, documents, flashcards, arcade,
// leaderboard, notifications, quizzes). Admins are teachers, not students, so
// they are sent to the teacher dashboard instead of being shown a student page.
const StudentRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Outlet />;
};

export default StudentRoute;
