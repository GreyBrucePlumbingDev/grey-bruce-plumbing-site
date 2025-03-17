import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
//import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';

function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  )
}

export default App