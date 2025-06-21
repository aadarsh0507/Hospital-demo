import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientEntry from './pages/PatientEntry';
import DoctorAppointment from './pages/DoctorAppointment';
import DoctorVisit from './pages/DoctorVisit';
import DoctorConsultation from './pages/DoctorConsultation';
import Pharmacy from './pages/Pharmacy';
import Checkout from './pages/Checkout';
import Reports from './pages/Reports';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient-entry"
        element={
          <ProtectedRoute>
            <PatientEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <DoctorAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-visit"
        element={
          <ProtectedRoute>
            <DoctorVisit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultation"
        element={
          <ProtectedRoute>
            <DoctorConsultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy"
        element={
          <ProtectedRoute>
            <Pharmacy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;