import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ForkliftDirectoryPage from './pages/ForkliftDirectoryPage';
import { useAuthStore } from './store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (isAuthenticated) {
    return <Navigate to="/forklifts" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forklifts"
        element={
          <ProtectedRoute>
            <ForkliftDirectoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/forklifts" replace />} />
      <Route path="*" element={<Navigate to="/forklifts" replace />} />
    </Routes>
  );
}
