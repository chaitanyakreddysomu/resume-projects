'use client';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FlowButton({ text = "Modern Button" }: { text?: string }) {
  const navigate = useNavigate();

  const handleGetQuoteClick = () => {
    navigate('/'); // navigate to home first

    // Wait for navigation, then scroll to #contact
    // We use a small timeout to ensure DOM updated after route change
    setTimeout(() => {
      const contactSection = document.getElementById('process');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  return (
    <button
    onClick={handleGetQuoteClick}
     className="group relative flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-blue-500/40 bg-transparent px-8 py-3 text-sm font-semibold text-blue-700 cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white hover:rounded-[12px] active:scale-[0.95]">
      {/* Left arrow */}
      <ArrowRight 
        className="absolute w-4 h-4 left-[-25%] stroke-blue-700 fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Circle */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-700 rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"></span>

      {/* Right arrow */}
      <ArrowRight 
        className="absolute w-4 h-4 right-4 stroke-blue-700 fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />
    </button>
  );
}
