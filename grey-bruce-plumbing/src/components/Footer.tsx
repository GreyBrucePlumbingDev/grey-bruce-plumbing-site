import { Link } from 'react-router-dom';
import Container from './common/Container';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = -50; // Adjust this value based on your navbar height
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition + offset;
            window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
            });
        }
        };

    return (
        <footer className="bg-[#152f59] text-white pt-12 pb-6">
        <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - Logo & Subtitle */}
            <div className="lg:col-span-1">
                <div className="mb-4">
                <img src="/logo-light.png" alt="Company Logo" className="h-12" />
                </div>
                <p className="text-sm text-gray-300">
                Trusted plumbers in the Owen Sound and surrounding areas
                </p>
            </div>

            {/* Column 2 - Links */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <ul className="space-y-2">
                <li>
                    <a  
                        onClick={() => scrollToSection('about')}
                        className="text-gray-300 hover:text-[#7ac144] transition-colors">
                    About Us
                    </a>
                </li>
                <li>
                    <a  
                        onClick={() => scrollToSection('services')}
                        className="text-gray-300 hover:text-[#7ac144] transition-colors">
                    Services
                    </a>
                </li>
                <li>
                    <a  
                        onClick={() => scrollToSection('reviews')}
                        className="text-gray-300 hover:text-[#7ac144] transition-colors">
                    Reviews
                    </a>
                </li>
                <li>
                    <a  
                        onClick={() => scrollToSection('blog')}
                        className="text-gray-300 hover:text-[#7ac144] transition-colors">
                    Blog
                    </a>
                </li>
                <li>
                    <Link to="/book" className="text-gray-300 hover:text-[#7ac144] transition-colors">
                    Book Now
                    </Link>
                </li>
                </ul>
            </div>

            {/* Column 3 - Contact (Owen Sound) */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <div className="space-y-4">
                <p className="flex items-center text-gray-300">
                    <FaPhone className="mr-2 text-[#7ac144]" /> 
                    <a href="tel:5551234567" className="hover:text-[#7ac144] transition-colors">
                    (555) 123-4567
                    </a>
                </p>
                <div>
                    <h4 className="font-medium text-[#7ac144] mb-1">Owen Sound</h4>
                    <address className="not-italic text-gray-300 text-sm">
                    <p className="flex items-start">
                        <FaMapMarkerAlt className="mr-2 mt-1 text-[#7ac144]" />
                        <span>
                        123 Main Street<br />
                        Owen Sound, ON N4K 5T6
                        </span>
                    </p>
                    </address>
                </div>
                </div>
            </div>

            {/* Column 4 - Contact (Second Location) */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Other Location</h3>
                <div className="space-y-4">
                <p className="flex items-center text-gray-300">
                    <FaPhone className="mr-2 text-[#7ac144]" /> 
                    <a href="tel:5557654321" className="hover:text-[#7ac144] transition-colors">
                    (555) 765-4321
                    </a>
                </p>
                <div>
                    <h4 className="font-medium text-[#7ac144] mb-1">Collingwood</h4>
                    <address className="not-italic text-gray-300 text-sm">
                    <p className="flex items-start">
                        <FaMapMarkerAlt className="mr-2 mt-1 text-[#7ac144]" />
                        <span>
                        456 Water Street<br />
                        Collingwood, ON L9Y 8H7
                        </span>
                    </p>
                    </address>
                </div>
                </div>
            </div>
            </div>

            {/* Bottom Section with Social & Copyright */}
            <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col-reverse md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
                © {new Date().getFullYear()} Your Plumbing Company. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#7ac144] transition-colors">
                <FaFacebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#7ac144] transition-colors">
                <FaInstagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#7ac144] transition-colors">
                <FaTwitter size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#7ac144] transition-colors">
                <FaLinkedin size={20} />
                </a>
            </div>
            </div>
        </Container>
        </footer>
    );
};

export default Footer;