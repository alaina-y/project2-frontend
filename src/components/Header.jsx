import { useAuth } from '../context/AuthContext';

const roleBadgeColor = {
  EMPLOYEE: 'bg-purple-100 text-purple-700',
  CUSTOMER: 'bg-green-100 text-green-700',
};

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeColor[user.role] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {user.role}
            </span>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {user.name?.charAt(0) ?? '?'}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
