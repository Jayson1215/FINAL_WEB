import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public pages
import Landing from './pages/Landing';

// Auth pages - eager load (needed before user logs in)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-purple-200 mb-4"></div>
      <p className="text-white text-lg font-semibold">Loading page...</p>
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
