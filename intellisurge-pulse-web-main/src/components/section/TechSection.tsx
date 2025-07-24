import { useState } from "react";
import { Code, Cloud , Cpu, ShieldCheck } from "lucide-react";

const tech = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Custom Software & Optimization",
    description: "Tailored solutions and performance enhancements built to meet your business needs."
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "AI & Data Intelligence",
    description: "Use AI, machine learning, and analytics to automate, optimize, and gain deeper insights."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Cybersecurity & Risk Management",
    description: "Enterprise-grade protection with continuous monitoring and security compliance."
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Infrastructure & Scalability",
    description: "Flexible, secure cloud solutions designed to grow with your business."
  }
];

export default function TechSection() {
  const [activeService, setActiveService] = useState(null);

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Comprehensive Tech Solutions
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-600"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Cutting-edge technology services tailored to your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tech.map((service, index) => (
            <div
              key={index}
              className="relative border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-500 transition-all duration-300 group min-h-[200px] cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={`${index * 200}`}
              onClick={() => setActiveService(service)}
            >
              <div className="absolute -top-5 -left-5 bg-blue-100 p-3 rounded-lg text-blue-600 shadow-sm">
                {service.icon}
              </div>
              <div className="pt-6 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Popup */}
        {activeService && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-auto relative shadow-lg">
              <button
                aria-label="Close modal"
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
                onClick={() => setActiveService(null)}
              >
                ×
              </button>
              <div className="mb-6">
                <div className="text-blue-600 mb-3">{activeService.icon}</div>
                <h3 className="text-xl font-semibold">{activeService.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{activeService.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
