import { useState } from "react";

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(null); // track clicked step

  const steps = [
    {
      step:"01.",
      title: "Strategy & Discovery",
      desc: "We begin by understanding your business goals, target audience, and project requirements to set a solid foundation."
    },
    {
      step:"02.",
      title: "Design & Prototyping",
      desc: "Wireframes and mockups are created to shape the product’s look and user experience."
    },
    {
      step:"03.",
      title: "Development & Testing",
      desc: "Our developers bring designs to life with clean code, followed by rigorous testing to ensure quality."
    },
    {
      step:"04.",
      title: "Launch & Ongoing Support",
      desc: "We deploy your product to the live environment and provide continuous support to ensure long-term success."
    }
  ];
  


  return (
    <section className="px-4 sm:px-6 lg:px-8" id="process">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            Our Process
          </h2>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col h-72 sm:h-80 text-left cursor-pointer hover:shadow-2xl transition"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
              onClick={() => setActiveStep(item)} // on click, set current step
            >
              <div>
                <div className="text-xl font-bold text-blue-500">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">{item.title}</h3>
              </div>
              <div className="flex-grow" />
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-12 bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="flex items-center space-x-4">
            {/* Avatar group */}
            <div className="flex -space-x-3">
              {[...Array(4)].map(() => {
                const randomId = Math.floor(Math.random() * 100);
                return (
                  <img
                    key={randomId + Math.random()}
                    src={`https://randomuser.me/api/portraits/men/${randomId}.jpg`}
                    alt="avatar"
                    className="w-9 h-9 rounded-full border-2 border-white"
                  />
                );
              })}
            </div>
            <p className="text-sm text-gray-800">
              Align with Businesses that{" "}
              <span className="font-semibold text-gray-900">Choose Quality</span>
            </p>
          </div>
          {/* Button */}
          <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold flex items-center space-x-2 hover:bg-blue-700 transition">
            <span>Start Now</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Modal */}
        {activeStep && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 overflow-hidden"
            aria-modal="true"
            role="dialog"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="bg-white rounded-lg max-w-md w-full shadow-lg relative max-h-[90vh] overflow-auto p-6 sm:p-8">
              {/* Close Button */}
              <button
                aria-label="Close modal"
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none"
                onClick={() => setActiveStep(null)}
              >
                ×
              </button>
              <h3 className="text-xl font-semibold mb-4" >{activeStep.title}</h3>
              <p className="text-sm text-gray-700" >{activeStep.desc}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
