import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: 'John Doe',
    role: 'Software Engineer',
    quote: 'This platform transformed my career! This platform transformed my career! This platform transformed my career!',
    image: 'https://thumbs.dreamstime.com/b/portrait-successful-business-woman-white-background-professional-109290811.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'Product Manager',
    quote: 'I love using this tool for all my projects.',
    image: 'team images/1.png',
  },
  {
    name: 'Alice Johnson',
    role: 'UX Designer',
    quote: 'A seamless experience from start to finish!',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
  },
];

function Testimonal() {
  const [current, setCurrent] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setIsExpanded(false);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsExpanded(false);
  };

  const { name, role, quote, image } = testimonials[current];

  return (
    <div className="w-full flex justify-center items-center py-10 px-4">
      <div className="relative w-full max-w-6xl md:h-72 h-auto bg-white shadow-xl rounded-lg flex flex-col md:flex-row items-center overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-2 md:top-1/2 md:-translate-y-1/2 px-3 py-3 bg-gray-300 hover:bg-blue-400 hover:text-white rounded-full z-10"
        >
          <FiArrowLeft size={24} />
        </button>

        {/* Card Content */}
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Left Side */}
          <div className="w-full md:w-3/4 flex flex-col justify-between py-6 px-4 sm:px-6 md:px-10 relative overflow-hidden md:ml-16">
            <FaQuoteLeft className="absolute top-4 left-4 text-gray-200 text-4xl md:text-6xl z-0 pointer-events-none select-none" />

            <div className="relative z-10 mb-2 mt-6 pr-2">
              <h2 className={`text-base sm:text-lg md:text-2xl font-semibold leading-snug ${isExpanded ? '' : 'line-clamp-3'}`}>
                “{quote}”
              </h2>
              {quote.split(' ').length > 20 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 text-sm text-blue-500 hover:underline focus:outline-none"
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>

            <div className="relative z-10 mt-2 mb-4 pr-2">
              <h3 className="text-base md:text-lg font-bold">{name}</h3>
              <p className="text-gray-600">{role}</p>
            </div>
          </div>

          {/* Right Side - Responsive image */}
          <div className="w-full md:w-1/4 h-64 md:h-full flex justify-center items-center border-t md:border-t-0 md:border-l">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-top object-cover"
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-2 md:top-1/2 md:-translate-y-1/2 px-3 py-3 bg-gray-300 hover:bg-blue-400 hover:text-white rounded-full z-10"
        >
          <FiArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default Testimonal;