import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import { ArrowDown } from "./icons"; // Assuming your ArrowDown component

export default function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          data-aos="fade-up"
          data-aos-delay="200"
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          data-aos="fade-down"
          data-aos-delay="400"
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          data-aos="fade-left"
          data-aos-delay="600"
        ></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        data-aos="zoom-in"
        data-aos-delay="800"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Welcome to the
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Future of Tech
          </span>
        </h1>
        <p
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto tracking-wide"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          IntelliSurge Technologies delivers cutting-edge software solutions that
          transform businesses and drive innovation forward.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          data-aos="fade-up"
          data-aos-delay="1200"
        >
          <button data-aos="fade-up-left" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            Get Started
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
            Contact Us
          </button>
        </div>

        <div
          className="mt-16"
          data-aos="fade-up"
          data-aos-delay="1400"
          data-aos-anchor-placement="top-bottom"
        >
          {/* <ArrowDown className="w-10 h-10 text-white mx-auto animate-bounce" /> */}
        </div>
      </div>
    </section>
  );
}
