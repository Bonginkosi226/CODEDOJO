import React from 'react';
import { BrowserRouter as Router, Routes,  Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/Quizzes/NotFoundPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FlashcardPage from './pages/Flashcards/FlashcardPage';
import FlashcardListPage from './pages/Flashcards/FlashcardListPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ArcadePage from './pages/Arcade/ArcadePage';
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import AdminRoute from './components/auth/AdminRoute';
import StudentRoute from './components/auth/StudentRoute';
import AdminOverviewPage from './pages/Admin/AdminOverviewPage';
import AdminStudentsPage from './pages/Admin/AdminStudentsPage';
import AdminStudentDetailPage from './pages/Admin/AdminStudentDetailPage';
import AdminStrugglesPage from './pages/Admin/AdminStrugglesPage';
import AdminAnnouncementsPage from './pages/Admin/AdminAnnouncementsPage';
import { useAuth } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { NotificationProvider } from './context/NotificationContext';


const App = () => {
  const { user, loading } = useAuth();
  
  if(loading) {
    return (
      <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
      </div>
    )
  }

   return (
    <Router>
      <NotificationProvider>
        <TelemetryProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />} />

              {/* Available to everyone, admins included (they use it to change their password) */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* Student-only pages — admins are redirected to /admin */}
              <Route element={<StudentRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/documents" element={<DocumentListPage />} />
                <Route path="/documents/:id" element={<DocumentDetailPage />} />
                <Route path="/flashcards" element={<FlashcardListPage />} />
                <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
                <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
                <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
                <Route path="/arcade" element={<ArcadePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>

              {/* Teacher dashboard — admins only (also enforced on every /api/admin route) */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminOverviewPage />} />
                <Route path="/admin/students" element={<AdminStudentsPage />} />
                <Route path="/admin/students/:id" element={<AdminStudentDetailPage />} />
                <Route path="/admin/struggles" element={<AdminStrugglesPage />} />
                <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TelemetryProvider>
      </NotificationProvider>
    </Router>
   );

}

export default App