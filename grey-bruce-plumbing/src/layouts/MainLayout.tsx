// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This is where your page content will be rendered */}
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default MainLayout;