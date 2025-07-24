// src/components/Footer.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';


const Footer = () => {
  const navigate = useNavigate();

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
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div data-aos="fade-right" data-aos-delay="50">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/Logo.png"
                className="h-8 sm:h-9 md:h-10 w-auto mr-1 sm:mr-2"
                alt="Logo"
              />
            </div>
            <p className="text-gray-400" data-aos="fade-right" data-aos-delay="0">
              Transforming businesses through innovative technology solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-aos="fade-right" data-aos-delay="50">Services</h3>
            <ul className="space-y-2 text-gray-400">
              {["Custom Development", "Cloud Solutions", "AI Automation", "Data Analytics"].map((service, i) => (
                <li key={i} data-aos="fade-right" data-aos-delay={100 + i * 50}>
                  <a href="/services" className="hover:text-white transition-colors">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-aos="fade-right" data-aos-delay="300">Company</h3>
            <ul className="space-y-2 text-gray-400">
  {[
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "#contact", isContact: true }
  ].map((item, i) => (
    <li key={i} data-aos="fade-right" data-aos-delay={350 + i * 50}>
      {item.isContact ? (
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            handleGetQuoteClick();
          }}
          className="hover:text-white transition-colors"
        >
          {item.label}
        </a>
      ) : (
        <Link to={item.to} className="hover:text-white transition-colors">
          {item.label}
        </Link>
      )}
    </li>
  ))}
</ul>

          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-aos="fade-right" data-aos-delay="550">Contact Info</h3>
            <ul className="space-y-4 text-gray-600">
            {[
              {
                icon: <HiOutlineMail className="inline-block mr-2 text-blue-600 h-5 w-5" />,
                text: "info@intellisurgetechnologies.com",
                delay: 600,
              },
              {
                icon: <HiOutlinePhone className="inline-block mr-2 text-green-600 h-5 w-5" />,
                text: "+91 8886 777 107",
                delay: 650,
              },
              {
                icon: <HiOutlineLocationMarker className="inline-block mr-2 text-red-600 h-10 w-10" />,
                text: "Workafella Western Pearl, Hitech City, 1st Floor, Kondapur, Hyderabad, Telangana 500084, India.",
                delay: 700,
              },
            ].map(({ icon, text, delay }, i) => (
              <li key={i} data-aos="fade-right" data-aos-delay={delay} className="flex items-start">
                {icon}
                <span>{text}</span>
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <p>&copy; 2024 IntelliSurge Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
