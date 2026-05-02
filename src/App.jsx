import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login    from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import CustomerDashboard       from './pages/customer/CustomerDashboard';
import EmployeeDashboard       from './pages/employee/EmployeeDashboard';
import CustomerManagement      from './pages/employee/CustomerManagement';
import AutoPolicyManagement    from './pages/employee/AutoPolicyManagement';
import HomePolicyManagement    from './pages/employee/HomePolicyManagement';
import HomeDetailsManagement   from './pages/employee/HomeDetailsManagement';
import VehicleDriverManagement from './pages/employee/VehicleDriverManagement';
import InvoiceManagement       from './pages/employee/InvoiceManagement';
import PaymentManagement       from './pages/employee/PaymentManagement';
import BusinessAnalysis        from './pages/employee/BusinessAnalysis';

function RequireAuth({ children, role }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="flex h-screen items-center justify-center text-gray-400 text-sm">Checking login status…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'CUSTOMER' ? '/customer/dashboard' : '/employee/dashboard'} replace />;
  return children;
}

function AppRoutes() {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="flex h-screen items-center justify-center text-gray-400 text-sm">Checking login status…</div>;

  return (
    <Routes>
      <Route path="/"        element={<Navigate to="/login" replace />} />
      <Route path="/login"   element={user ? <Navigate to={user.role === 'CUSTOMER' ? '/customer/dashboard' : '/employee/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/customer/dashboard" element={<RequireAuth role="CUSTOMER"><CustomerDashboard /></RequireAuth>} />

      <Route path="/employee/dashboard"        element={<RequireAuth role="EMPLOYEE"><EmployeeDashboard /></RequireAuth>} />
      <Route path="/employee/customers"        element={<RequireAuth role="EMPLOYEE"><CustomerManagement /></RequireAuth>} />
      <Route path="/employee/auto-policies"    element={<RequireAuth role="EMPLOYEE"><AutoPolicyManagement /></RequireAuth>} />
      <Route path="/employee/home-policies"    element={<RequireAuth role="EMPLOYEE"><HomePolicyManagement /></RequireAuth>} />
      <Route path="/employee/homes"            element={<RequireAuth role="EMPLOYEE"><HomeDetailsManagement /></RequireAuth>} />
      <Route path="/employee/vehicles-drivers" element={<RequireAuth role="EMPLOYEE"><VehicleDriverManagement /></RequireAuth>} />
      <Route path="/employee/invoices"         element={<RequireAuth role="EMPLOYEE"><InvoiceManagement /></RequireAuth>} />
      <Route path="/employee/payments"         element={<RequireAuth role="EMPLOYEE"><PaymentManagement /></RequireAuth>} />
      <Route path="/employee/analytics"        element={<RequireAuth role="EMPLOYEE"><BusinessAnalysis /></RequireAuth>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
