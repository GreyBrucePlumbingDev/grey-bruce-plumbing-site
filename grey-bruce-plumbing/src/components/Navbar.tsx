// src/components/Navbar.tsx
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServiceAreaOpen, setIsServiceAreaOpen] = useState(false);
  
  // Active section tracking (in a real implementation, this would update based on scroll position)
  const [activeSection, setActiveSection] = useState('home');
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
    setIsOpen(false);
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-md">

      {/* Mobile menu button */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a onClick={() => scrollToSection('home')} className={activeSection === 'home' ? 'underline' : ''}>Home</a></li>
              <li><a onClick={() => scrollToSection('services')} className={activeSection === 'services' ? 'underline' : ''}>Services</a></li>
              <li><a onClick={() => scrollToSection('about')} className={activeSection === 'about' ? 'underline' : ''}>About Us</a></li>
              <li><a onClick={() => scrollToSection('reviews')} className={activeSection === 'reviews' ? 'underline' : ''}>Reviews</a></li>
              <li><a onClick={() => scrollToSection('blog')} className={activeSection === 'blog' ? 'underline' : ''}>Blog</a></li>
            </ul>
          )}
        </div>
        {/* Logo */}
        <a className="btn btn-ghost">
          <img src="/src/assets/logo.png" alt="Grey-Bruce Plumbing" className="h-10" />
        </a>
      </div>
      
      {/* Desktop navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a 
              onClick={() => scrollToSection('home')} 
              className={`hover:bg-transparent ${activeSection === 'home' ? 'underline font-medium' : ''}`}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              onClick={() => scrollToSection('services')} 
              className={`hover:bg-transparent ${activeSection === 'services' ? 'underline font-medium' : ''}`}
            >
              Services
            </a>
          </li>
          <li>
            <a 
              onClick={() => scrollToSection('about')}
              className={`hover:bg-transparent ${activeSection === 'about' ? 'underline font-medium' : ''}`}
            >
              About Us
            </a>
          </li>
          <li>
            <a 
              onClick={() => scrollToSection('reviews')}
              className={`hover:bg-transparent ${activeSection === 'reviews' ? 'underline font-medium' : ''}`}
            >
              Reviews
            </a>
          </li>
          <li>
            <a 
              onClick={() => scrollToSection('blog')}
              className={`hover:bg-transparent ${activeSection === 'blog' ? 'underline font-medium' : ''}`}
            >
              Blog
            </a>
          </li>
          <li>
          <a 
              onClick={() => scrollToSection('serviceArea')}
              className={`hover:bg-transparent ${activeSection === 'serviceArea' ? 'underline font-medium' : ''}`}
            >
              Service Area
            </a>
          </li>
        </ul>
      </div>
      
      {/* Contact information and CTA buttons */}
      <div className="navbar-end">
        <div className="hidden md:flex flex-col items-end mr-4">
          <span className="text-sm font-medium">(555) 123-4567</span>
          <span className="text-xs">Call us at (555) 999-8888 for 24/7 service</span>
        </div>
        <a className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white border-none mr-2">Book Now</a>
        <a className="btn bg-[#152f59] hover:bg-[#0e2040] text-white border-none">Contact Us</a>
      </div>
    </div>
  );
};

export default Navbar;