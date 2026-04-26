import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public pages
import Landing from './pages/homepage';

// Auth pages - eager load
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SocialCallback from './pages/auth/SocialCallback';

// Client pages - lazy loaded
const Dashboard = React.lazy(() => import('./pages/client/Dashboard'));
const PortfolioGallery = React.lazy(() => import('./pages/client/PortfolioGallery'));
const ServicesList = React.lazy(() => import('./pages/client/PackageList'));
const BookingPage = React.lazy(() => import('./pages/client/BookingPage'));
const MyBookings = React.lazy(() => import('./pages/client/MyBookings'));
const CheckoutPage = React.lazy(() => import('./pages/client/CheckoutPage'));
const PaymentSuccess = React.lazy(() => import('./pages/client/PaymentSuccess'));
const Contact = React.lazy(() => import('./pages/client/Contact'));

// Admin pages - lazy loaded
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageServices = React.lazy(() => import('./pages/admin/ManageServices'));
const ManagePortfolio = React.lazy(() => import('./pages/admin/ManagePortfolio'));
const BookingManager = React.lazy(() => import('./pages/admin/BookingManager'));
const ManageUsers = React.lazy(() => import('./pages/admin/ManageUsers'));
const RevenueReports = React.lazy(() => import('./pages/admin/RevenueReports'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-[#F0F2F5]">
    <div className="text-center">
      <div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1E293B]">LIGHT Photography</p>
      <p className="text-[9px] uppercase tracking-[0.4em] text-[#94A3B8] mt-2">On-Call Service</p>
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
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/Packages"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <ServicesList />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/Portfolio"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <PortfolioGallery />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/Gallery"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <PortfolioGallery />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/MyBookings"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <MyBookings />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/contact"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path="/client/packages/book/:serviceId"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <BookingPage />
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
      <Route
        path="/payment/success"
        element={
          <PrivateRoute requiredRole="client">
            <Suspense fallback={<PageLoader />}>
              <PaymentSuccess />
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
