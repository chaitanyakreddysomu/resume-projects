import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { MagneticButton } from './ui/magnetic-button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetQuoteClick = () => {
    navigate('/'); // navigate to home first

    // Wait for navigation, then scroll to #contact
    // We use a small timeout to ensure DOM updated after route change
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Careers', path: '/careers' },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-500 ease-in-out bg-
        ${
          // Only add bg blur on scroll for mobile (sm and below)
          scrolled
            ? 'sm:bg-transparent bg-white/70 sm:backdrop-blur-0 backdrop-blur-md sm:shadow-none shadow-lg border-b border-gray-200 sm:border-0'
            : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:py-8">
          {/* Left - Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Logo.png"
              className="h-8 sm:h-9 md:h-10 w-auto"
              alt="Logo"
              data-aos="fade-down" data-aos-delay='200'
            />
          </Link>

          {/* Center - Navigation Pill */}
          <div className="hidden md:flex items-center space-x-10 px-10 py-4 bg-white/30 backdrop-blur-md rounded-full shadow-[0_4px_20px_-8px_rgba(59,130,246,0.5)] "  data-aos="fade-down" data-aos-delay='400'>
            {navItems.map((item) => {
              const active = isActiveLink(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    relative font-medium text-base transition-colors duration-300 group
                    before:content-[''] before:absolute before:top-[-12px] before:left-1/2 before:-translate-x-1/2
                    before:w-1.5 before:h-1.5 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300
                    ${active ? 'text-blue-700 before:opacity-100 before:bg-blue-600 before:shadow-[0_0_10px_3px_rgba(59,130,246,0.6)]' : 'text-gray-900 hover:text-blue-600 hover:before:opacity-100 hover:before:bg-blue-400 hover:before:shadow-[0_0_6px_2px_rgba(59,130,246,0.4)]'}
                  `}

                  aria-current={active ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right - Get a Quote Button */}
          <div data-aos="fade-down" data-aos-delay='600'>

          {/* <button
      onClick={handleGetQuoteClick}
      className="hidden md:inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      Get a Quote
    </button> */}

<MagneticButton>
      <button
      onClick={handleGetQuoteClick}
      //  className="bg-gradient-to-r from-blue-600 to-purple-600  transition-colors px-10 text-lg text-white py-4 rounded-full">
       className="hidden md:inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
      Get a Quote
      </button>
    </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X
                className={`w-6 h-6 ${
                  scrolled ? 'text-gray-900' : 'text-gray-900'
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  scrolled ? 'text-gray-900' : 'text-gray-900'
                }`}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className={`md:hidden rounded-lg shadow-lg p-4 mb-4 space-y-2 max-w-full overflow-x-hidden bg-white`}
          >
            {navItems.map((item) => {
              const active = isActiveLink(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-2 text-gray-900 transition-colors duration-300 ${
                    active ? 'text-blue-700' : 'hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/#contact"
              className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-center hover:shadow-lg transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
