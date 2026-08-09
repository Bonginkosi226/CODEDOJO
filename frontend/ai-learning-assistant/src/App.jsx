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
import { useAuth } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { NotificationProvider } from './context/NotificationContext';


const App = () => {
  const { isAuthenticated, loading } = useAuth();
  
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/documents" element={<DocumentListPage />} />
              <Route path="/documents/:id" element={<DocumentDetailPage />} />
              <Route path="/flashcards" element={<FlashcardListPage />} />
              <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
              <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
              <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/arcade" element={<ArcadePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TelemetryProvider>
      </NotificationProvider>
    </Router>
   );

}

export default App