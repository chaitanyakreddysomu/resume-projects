import React, { useState } from 'react';
import { FaHistory } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { LuBotMessageSquare } from "react-icons/lu";


const FloatingButtons = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const phoneNumber = "+918886777107";
  const message = "Hi! I'm interested in IntelliSurge Technologies services.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleVersion1Click = () => {
    const version1URL = "https://www.intellisurgetechnologies.com/";
    window.open(version1URL, '_blank');
  };

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <>
      {/* Floating Side Buttons Container */}
      <div className="fixed top-1/3 right-0 z-50 flex flex-col items-end space-y-3">
        {/* Chatbot Button */}
        <div
          onClick={toggleChatbot}
          className="group cursor-pointer bg-purple-600 text-white w-12 h-12 flex items-center justify-center rounded-l-full shadow-md hover:w-16 transition-all duration-300"
          data-aos="fade-left"
          data-aos-delay="300"
          aria-label="Chatbot"
        >
          <LuBotMessageSquare className="w-6 h-6"/>
        </div>

        {/* Version 1 Button */}
        <div
          onClick={handleVersion1Click}
          className="group cursor-pointer bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-l-full shadow-md hover:w-16 transition-all duration-300"
          data-aos="fade-left"
          data-aos-delay="500"
          aria-label="Visit Version 1"
        >
          <FaHistory className="w-5 h-5" />
        </div>

        {/* WhatsApp Button */}
        <div
          onClick={handleWhatsAppClick}
          className="group cursor-pointer bg-green-500 text-white w-12 h-12 flex items-center justify-center rounded-l-full shadow-md hover:w-16 transition-all duration-300"
          data-aos="fade-left"
          data-aos-delay="700"
          aria-label="Contact on WhatsApp"
        >
          <FaWhatsapp className="w-5 h-5" />
        </div>
      </div>

      {/* Chatbot Panel */}
      {showChatbot && (
  <div
    className="fixed bottom-24 right-4 w-[350px] h-[500px] bg-white border rounded shadow-xl z-50 overflow-hidden animate-open-from-icon origin-bottom-right"
    data-aos="fade-left"
    data-aos-offset="0"
    data-aos-once="true"
  >
    <div className="flex justify-end p-2 bg-gray-100">
      <button
        onClick={toggleChatbot}
        className="text-gray-600 hover:text-black text-xl font-bold"
        aria-label="Close Chatbot"
      >
        ×
      </button>
    </div>
    <iframe
      src="https://www.chatbase.co/chatbot-iframe/RPTK2aqaSuzJijJBmMMy7"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
      title="Chatbot"
    ></iframe>
  </div>
)}

    </>
  );
};

export default FloatingButtons;
