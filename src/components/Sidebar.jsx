import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const employeeNav = [
  { to: '/employee/dashboard',        label: 'Dashboard'          },
  { to: '/employee/customers',        label: 'Customers'          },
  { to: '/employee/auto-policies',    label: 'Auto Policies'      },
  { to: '/employee/home-policies',    label: 'Home Policies'      },
  { to: '/employee/homes',            label: 'Homes'              },
  { to: '/employee/vehicles-drivers', label: 'Vehicles & Drivers' },
  { to: '/employee/invoices',         label: 'Invoices'           },
  { to: '/employee/payments',         label: 'Payments'           },
  { to: '/employee/analytics',        label: 'Business Analytics' },
];

const customerNav = [
  { to: '/customer/dashboard', label: 'My Dashboard' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'EMPLOYEE' ? employeeNav : customerNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-blue-900 text-white shadow-xl">
      <div className="border-b border-blue-700 px-6 py-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1">HJY Insurance</div>
        <div className="text-xl font-bold text-white leading-tight">Management System</div>
      </div>

      <div className="border-b border-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name ?? user?.username ?? 'User'}</p>
            <p className="text-xs text-blue-300">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => console.log('Current route:', item.to)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-blue-700 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-200 hover:bg-red-600 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
