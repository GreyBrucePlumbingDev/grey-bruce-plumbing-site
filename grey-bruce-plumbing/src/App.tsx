import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import AboutPage from "./pages/AboutPage"
import HomePage from "./pages/HomePage"
import ServicePage from "./pages/ServicePage"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import BlogEditor from "./components/AdminSections/BlogEditor"
import BlogPage from "./pages/Blogs"
import BlogPostPage from "./pages/BlogPost"
import ServiceAreaLanding from "./components/ServiceAreaLanding"
import ServiceAreaIndex from "./components/ServiceAreaIndex"
import DomainRedirector from "./components/DomainRedirector"
import ServicesPage from "./pages/ServicesPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DomainRedirector />
        <Routes>
          {/* Wrap everything in MainLayout (navbar and footer and chatbot) */}
          <Route path="/" element={<MainLayout />}>
            {/* define routes and access points */}
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />

            {/* Service pages with dynamic routing */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:serviceSlug" element={<ServicePage />} />

            {/* Service Area pages */}
            <Route path="service-areas" element={<ServiceAreaIndex />} />
            <Route path="service-area/:areaSlug" element={<ServiceAreaLanding />} />

            {/* Blog pages with dynamic routing */}
            <Route path="blogs" element={<BlogPage />} />
            <Route path="blogs/:postId" element={<BlogPostPage />} />

            {/* Add more routes as needed */}
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="admin/blog/new" element={<BlogEditor blogFolderPath="blog-images" />} />
            <Route path="admin/blog/edit/:id" element={<BlogEditor blogFolderPath="blog-images" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

