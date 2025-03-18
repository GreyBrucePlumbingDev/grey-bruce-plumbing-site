import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
//import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Wrap everything in MainLayout (navbar and footer and chatbot) */}
          <Route path="/" element={<MainLayout />}>
            {/* define routes and access points */}
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            
            {/* Service pages with dynamic routing */}
            <Route path="services/:serviceSlug" element={<ServicePage />} />
            
            {/*<Route path="blog" element={<BlogPage />} />
            {/* Add more routes as needed */}
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            {/* Add more admin routes as needed */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App