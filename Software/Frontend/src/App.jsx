import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostProblem from './pages/PostProblem';
import ProblemDetail from './pages/ProblemDetail';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import Workspace from './pages/Workspace';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Explorer from './pages/Explorer';
import Messages from './pages/Messages';
import { useEffect, useState } from 'react';
import { NOTIFICATIONS } from './mock/data';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user) setNotifCount((NOTIFICATIONS[user.id] || []).filter(n => !n.read).length);
  }, [user]);

  return (
    <>
      {!['/login', '/register'].includes(location.pathname) && <Navbar notifCount={notifCount} />}
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explorer />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post-problem" element={<ProtectedRoute><PostProblem /></ProtectedRoute>} />
        <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        <Route path="/workspace/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" toastOptions={{
          style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
