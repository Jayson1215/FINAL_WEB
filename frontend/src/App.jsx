import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public pages
import Landing from './pages/homepage';

// Auth pages - eager load
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SocialCallback from './pages/auth/SocialCallback';

// Client pages - eager load
import Dashboard from './pages/client/Dashboard';
import PortfolioGallery from './pages/client/PortfolioGallery';
import ServicesList from './pages/client/PackageList';
import BookingPage from './pages/client/BookingPage';
import MyBookings from './pages/client/MyBookings';
import CheckoutPage from './pages/client/CheckoutPage';
import PaymentSuccess from './pages/client/PaymentSuccess';
import Contact from './pages/client/Contact';

// Admin pages - eager load
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageServices from './pages/admin/ManageServices';
import ManagePortfolio from './pages/admin/ManagePortfolio';
import BookingManager from './pages/admin/BookingManager';
import ManageUsers from './pages/admin/ManageUsers';
import RevenueReports from './pages/admin/RevenueReports';

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-[#F0F2F5]">
    <div className="text-center">
      <div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1E293B]">Loading Lightworks...</p>
    </div>
  </div>
);

const HomeEntry = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Landing />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/client/home" replace />;
};

// Protected route wrapper
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<SocialCallback />} />

      {/* Client Routes */}
      <Route
        path="/client/home"
        element={
          <PrivateRoute requiredRole="client">
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/Packages"
        element={
          <PrivateRoute requiredRole="client">
            <ServicesList />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/Portfolio"
        element={
          <PrivateRoute requiredRole="client">
            <PortfolioGallery />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/Gallery"
        element={
          <PrivateRoute requiredRole="client">
            <PortfolioGallery />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/MyBookings"
        element={
          <PrivateRoute requiredRole="client">
            <MyBookings />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/contact"
        element={
          <PrivateRoute requiredRole="client">
            <Contact />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/packages/book/:serviceId"
        element={
          <PrivateRoute requiredRole="client">
            <BookingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/checkout"
        element={
          <PrivateRoute requiredRole="client">
            <CheckoutPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/success"
        element={
          <PrivateRoute requiredRole="client">
            <PaymentSuccess />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/PaymentSuccess"
        element={
          <PrivateRoute requiredRole="client">
            <PaymentSuccess />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <PrivateRoute requiredRole="admin">
            <ManageServices />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/portfolio"
        element={
          <PrivateRoute requiredRole="admin">
            <ManagePortfolio />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <PrivateRoute requiredRole="admin">
            <BookingManager />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute requiredRole="admin">
            <ManageUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <PrivateRoute requiredRole="admin">
            <RevenueReports />
          </PrivateRoute>
        }
      />

      {/* Main Entry Point */}
      <Route path="/" element={<HomeEntry />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
