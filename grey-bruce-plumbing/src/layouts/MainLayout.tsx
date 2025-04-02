import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChatbotProvider } from '../contexts/chatbot-context';
import { ChatbotContainer } from '../components/chatbot/chatbot-container';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <ChatbotProvider>
        <ChatbotContainer />
      </ChatbotProvider>
      <Footer />
    </div>
  );
};

export default MainLayout;