
import React, { useEffect, useState } from 'react';
import TestimonialCard from './TestimonialCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
    {
      id: 1,
      name: "Michelle Andersson",
      title: "TITEL",
      company: "dshbsjdh",
      testimonial: "En underbar dolor amet consectetur eros don libre vesto ultrice pellesque donec li andrago dolor amet consectetur dolorem.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "CEO",
      company: "INNOVATION CO",
      testimonial: "This platform has completely transformed how we approach our business strategy and customer engagement.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "David Chen",
      title: "DIRECTOR",
      company: "TECH SOLUTIONS",
      testimonial: "Outstanding results and exceptional service delivery. The team exceeded all our expectations.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      title: "MANAGER",
      company: "CREATIVE AGENCY",
      testimonial: "Professional, reliable, and innovative. Working with this team has been an absolute pleasure.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "James Wilson",
      title: "FOUNDER",
      company: "STARTUP VENTURES",
      testimonial: "The attention to detail and commitment to excellence is evident in every aspect of their work.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    }
  ];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div
      className="relative w-full flex flex-col items-center py-12 px-4 sm:px-8 md:px-16"
      data-aos="fade-up"
      data-aos-delay="400"
    >
      {/* Arrow buttons */}
      <div className="absolute left-4 sm:left-8 md:left-16 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handlePrev}
          className="p-2 text-gray-500 hover:text-blue-600 transition"
          aria-label="Previous testimonial"
        >
          <ArrowLeft size={28} className="sm:w-8 sm:h-8" />
        </button>
      </div>

      <div className="absolute right-4 sm:right-8 md:right-16 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={handleNext}
          className="p-2 text-gray-500 hover:text-blue-600 transition"
          aria-label="Next testimonial"
        >
          <ArrowRight size={28} className="sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Main active testimonial card */}
      <div className="w-full max-w-3xl sm:max-w-4xl">
        <TestimonialCard
          {...testimonials[currentIndex]}
          isActive={true}
          surroundingImages={[
            testimonials[(currentIndex - 2 + testimonials.length) % testimonials.length].image,
            testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length].image,
            testimonials[(currentIndex + 1) % testimonials.length].image,
            testimonials[(currentIndex + 2) % testimonials.length].image,
          ]}
        />
      </div>
    </div>
  );
};

export default TestimonialCarousel;
