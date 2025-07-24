import React from 'react';

interface TestimonialCardProps {
  name: string;
  title: string;
  company: string;
  testimonial: string;
  image: string;
  isActive?: boolean;
  surroundingImages: string[]; // [left2, left1, right1, right2]
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  title,
  company,
  testimonial,
  image,
  surroundingImages,
  isActive = false
}) => {
  const sizes = [
    // smallest to largest with responsive variants
    'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-40 scale-90',
    'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-80 scale-95',
    'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-100 scale-100 ring-2 ring-blue-700 z-10',
    'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-80 scale-95',
    'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-40 scale-90'
  ];

  const images = [
    surroundingImages[0],
    surroundingImages[1],
    image,
    surroundingImages[2],
    surroundingImages[3]
  ];

  return (
    <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 md:px-0">
      {/* Thumbnails row */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8 border-none">
        {images.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt=""
            className={`rounded-full object-cover ${sizes[index]} transition-transform duration-300`}
            data-aos="fade-up" data-aos-delay={`${400 + index * 100}`}
          />
        ))}
      </div>

      {/* Name & Title */}
      <div className="mb-4 sm:mb-6">
        <h3
          className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          {name}
        </h3>
        <p
          className="text-gray-500 uppercase tracking-wider text-xs sm:text-sm md:text-sm font-medium"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {title}, {company}
        </p>
      </div>

      {/* Testimonial Text */}
      <p
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light"
        data-aos="fade-up"
        data-aos-delay="700"
      >
        {testimonial}
      </p>
    </div>
  );
};

export default TestimonialCard;
