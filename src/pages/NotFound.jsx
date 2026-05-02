import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-8xl font-bold text-blue-200 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-2">The page you are looking for does not exist.</p>
        <p className="text-sm text-gray-400 mb-8 font-mono">{pathname}</p>
        <Link to="/login" className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
