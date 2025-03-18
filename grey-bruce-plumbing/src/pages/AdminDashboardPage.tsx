// src/pages/AdminDashboardPage.tsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-lg font-medium text-gray-900">Welcome to your admin panel</h2>
            <p className="mt-2 text-gray-600">
              Here you can manage your website content through Supabase.
            </p>
            {/* Add your admin functionality here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;