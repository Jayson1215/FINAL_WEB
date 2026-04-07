import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public pages
import Landing from './pages/homepage';

// Auth pages - eager load (needed before user logs in)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SocialCallback from './pages/auth/SocialCallback';

// Client pages - lazy loaded
const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard'));
const PortfolioGallery = React.lazy(() => import('./pages/client/PortfolioGallery'));
const ServicesList = React.lazy(() => import('./pages/client/ServicesList'));
const BookingPage = React.lazy(() => import('./pages/client/BookingPage'));
const MyBookings = React.lazy(() => import('./pages/client/MyBookings'));
const CheckoutPage = React.lazy(() => import('./pages/client/CheckoutPage'));

// Admin pages - lazy loaded
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageServices = React.lazy(() => import('./pages/admin/ManageServices'));
const ManagePortfolio = React.lazy(() => import('./pages/admin/ManagePortfolio'));
const BookingManager = React.lazy(() => import('./pages/admin/BookingManager'));
const ManageUsers = React.lazy(() => import('./pages/admin/ManageUsers'));
const RevenueReports = React.lazy(() => import('./pages/admin/RevenueReports'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-[#F9F9F9]">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[#C79F68] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#333]">PhotoStudio</p>
    </div>
  </div>
);

// Protected route wrapper
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Strict role checking - redirect if role doesn't match
  if (requiredRole && user.role !== requiredRole) {
    console.warn(`Access denied: User role '${user.role}' does not match required role '${requiredRole}'`);
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} replace />;
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
        path="/client/dashboard"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <ClientDashboard />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/portfolio"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <PortfolioGallery />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/services"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <ServicesList />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/booking/:serviceId"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <BookingPage />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/bookings"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <MyBookings />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/checkout"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <CheckoutPage />
            </Suspense>
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <PrivateRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <ManageServices />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/portfolio"
        element={
          <PrivateRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <ManagePortfolio />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <PrivateRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <BookingManager />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <ManageUsers />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <PrivateRoute requiredRole="admin">
            <Suspense fallback={<PageLoader />}>
              <RevenueReports />
            </Suspense>
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Landing />} />
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
