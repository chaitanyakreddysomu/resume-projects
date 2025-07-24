import React from "react";
// import Navbar from "../Navbar"; // Adjust the path based on your file structure
import { ArrowDown } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Heromain = () => {

  const navigate = useNavigate();

  const handleGetQuoteClick = () => {
    // navigate('/'); // navigate to home first

    // Wait for navigation, then scroll to #contact
    // We use a small timeout to ensure DOM updated after route change
    setTimeout(() => {
      const contactSection = document.getElementById('technologies');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-300 filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-300 filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900" data-aos="fade-up" data-aos-delay="200">
              Transform Your Data Into Actionable Insights
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10" data-aos="fade-up" data-aos-delay="400">
              We help businesses leverage data analytics, business intelligence, and automation
              to make confident, data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-500">
            <button
            onClick={handleGetQuoteClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              data-aos="fade-up" data-aos-delay="600"
            >
              Get Started
            </button>

              {/* <button className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-200 px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              data-aos="fade-up" data-aos-delay="700"
              >
                Learn More
              </button> */}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce" data-aos="fade-up" data-aos-delay="200"> 
          <button 
            onClick={handleGetQuoteClick}
            className="text-blue-600 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Heromain;
