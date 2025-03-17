// src/components/Navbar.tsx
import Container from './common/Container';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = -15; // Adjust this value based on your navbar height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='bg-base-100 sticky top-0 z-50 shadow-md'>
      <Container>
        <div className="navbar h-25">
          {/* mobile menu button */}
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => scrollToSection('home')} className={'home'}>Home</a></li>
                <li><a onClick={() => scrollToSection('services')} className={'services'}>Services</a></li>
                <li><a onClick={() => scrollToSection('about')} className={'about'}>About Us</a></li>
                <li><a onClick={() => scrollToSection('reviews')} className={'reviews'}>Reviews</a></li>
                <li><a onClick={() => scrollToSection('blog')} className={'blog'}>Blog</a></li>
                <li><a onClick={() => scrollToSection('serviceArea')} className={'serviceArea'}>Service Area</a></li>
              </ul>
              
            </div>
            {/* Logo */}
            <Link to="/" className="btn btn-ghost ml-1">
              <img src="../src/assets/logo.png" alt="Grey-Bruce Plumbing" className="h-8 sm:h-10 md:h-12 lg:h-16 xl:h-20" />
            </Link>
          </div>
          
          {/* desktop navigation */}
          <div className="navbar-center hidden lg:flex justify-center flex-grow mr-25">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a 
                  onClick={() => scrollToSection('home')} 
                  className={`hover:bg-transparent ${ 'home' }`}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection('services')} 
                  className={`hover:bg-transparent ${ 'services' }`}
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection('about')}
                  className={`hover:bg-transparent ${ 'about' }`}
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection('reviews')}
                  className={`hover:bg-transparent ${ 'reviews' }`}
                >
                  Reviews
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection('blog')}
                  className={`hover:bg-transparent ${ 'blog' }`}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection('serviceArea')}
                  className={`hover:bg-transparent ${ 'serviceArea' }`}
                >
                  Service Area
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact information and CTA buttons */}
          <div className="navbar-end flex items-center">
            <div className="hidden md:flex flex-col items-end mr-2 lg:mr-4">
              <span className="text-sm font-medium">(555) 123-4567</span>
              <span className="text-xs">24/7 service: (555) 999-8888</span>
            </div>
            
            {/* Responsive CTA buttons */}
            <div className="flex flex-col sm:flex-row">
              <a className="btn btn-sm sm:btn-md bg-[#7ac144] hover:bg-[#6aad39] text-white border-none mr-1 mb-1 sm:mb-0 sm:mr-2 px-2 sm:px-4">Book Now</a>
              <a className="btn btn-sm sm:btn-md bg-[#152f59] hover:bg-[#0e2040] text-white border-none px-2 sm:px-4">Contact Us</a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;