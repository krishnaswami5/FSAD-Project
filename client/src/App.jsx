import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages — Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages — Public
import Home from './pages/Home';
import Artworks from './pages/artworks/Artworks';
import ArtworkDetail from './pages/artworks/ArtworkDetail';
import VirtualTour from './pages/tour/VirtualTour';

// Pages — Cart
import Cart from './pages/cart/Cart';
import Checkout from './pages/cart/Checkout';
import OrderConfirmation from './pages/cart/OrderConfirmation';

// Pages — Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1a1a26', border: '1px solid #2a2a3e', color: '#fff' },
        success: { iconTheme: { primary: '#4ade80', secondary: '#1a1a26' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#1a1a26' } },
      }}
    />

    <Routes>
      {/* Auth layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main layout (public) */}
      <Route element={<MainLayout />}>
        <Route index           element={<Home />} />
        <Route path="/artworks"    element={<Artworks />} />
        <Route path="/artworks/:id" element={<ArtworkDetail />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />

        {/* Protected */}
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute><OrderConfirmation /></ProtectedRoute>
        } />
      </Route>

      {/* Dashboard layout (protected) */}
      <Route element={
        <ProtectedRoute><DashboardLayout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/*"   element={<Dashboard />} />
        <Route path="/artist/*"  element={<Dashboard />} />
        <Route path="/curator/*" element={<Dashboard />} />
        <Route path="/visitor/*" element={<Dashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;
