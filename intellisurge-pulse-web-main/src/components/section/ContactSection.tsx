import { useState } from "react";

export default function ContactSection() {
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const items = techInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item && !technologies.includes(item));

      setTechnologies((prev) => [...prev, ...items]);
      setTechInput("");
    }
  };

  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(",") || value.includes("\n")) {
      const items = value
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter((item) => item && !technologies.includes(item));

      setTechnologies((prev) => [...prev, ...items]);
      setTechInput("");
    } else {
      setTechInput(value);
    }
  };

  const removeTechnology = (index: number) => {
    setTechnologies((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <h2
            className="text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Contact Us
          </h2>
          <p
            className="text-xl text-gray-600"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Ready to start your next project?
          </p>
        </div>

        <div className="grid lg:grid-cols-10 gap-12">
          <div className="lg:col-span-7 animate-on-scroll">
            <form
              className="space-y-6"
              data-aos="fade-right"
              data-aos-delay="400"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Full Name & Email */}
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                    data-aos="fade-right"
                    data-aos-delay="500"
                  />
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                    data-aos="fade-right"
                    data-aos-delay="600"
                  />
                </div>
              </div>

              {/* Company & Domain */}
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your company"
                    data-aos="fade-right"
                    data-aos-delay="700"
                  />
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your domain"
                    data-aos="fade-right"
                    data-aos-delay="800"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your address"
                  data-aos="fade-right"
                  data-aos-delay="900"
                />
              </div>

              {/* Technologies from previous component */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Client is Looking For
                </label>
                <input
                  id="technologies"
                  value={techInput}
                  onChange={handleTechInputChange}
                  onKeyDown={handleTechKeyDown}
                  placeholder="e.g. React, Node.js, AWS"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  data-aos="fade-right"
                  data-aos-delay="1000"
                />
                <div className="flex flex-wrap mt-3 gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tell us about your project..."
                  data-aos="fade-right"
                  data-aos-delay="1100"
                ></textarea>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay="1200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 animate-on-scroll flex flex-col justify-between">
  {/* Get in Touch - 60% */}
  <div
    className="bg-gray-100 rounded-2xl p-6 mb-6"
    style={{ flex: "0 0 60%" }}
    data-aos="fade-up"
    data-aos-delay="100"
  >
    <h3 className="text-xl font-semibold text-blue-800 mb-4">Get in Touch</h3>
    <div className="space-y-4 text-left text-gray-700 text-sm">
      <div>
        <strong>Email:</strong><br />
        <a href="mailto:info@intellisurgetechnologies.com" className="text-blue-600 hover:underline">
          info@intellisurgetechnologies.com
        </a>
      </div>
      <div>
        <strong>Phone:</strong><br />
        +91 8886 777 107<br />
        040 316 321 80
      </div>
      <div>
        <strong>Address:</strong><br />
        Workafella Western Pearl, Hitech City,<br />
        1st Floor, Kondapur, Hyderabad,<br />
        Telangana 500084, India.
      </div>
      <div>
        <strong>Business Hours:</strong><br />
        Mon - Fri: 9 AM - 6 PM<br />
        Sat - Sun: Closed
      </div>
    </div>
  </div>

  {/* Map Placeholder - 40% */}
  <div
    className="bg-gray-200 rounded-2xl flex items-center justify-center text-center text-gray-600 text-sm"
    style={{ flex: "0 0 40%" }}
    data-aos="fade-up"
    data-aos-delay="200"
  >
    <iframe
        title="Google Map Location"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d101652.82067558003!2d78.373088!3d17.458094!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb930050df72ff%3A0xc8c72b35895e2771!2sIntelliSurge%20Technologies%20Pvt.%20Ltd.!5e1!3m2!1sen!2sin!4v1748941230503!5m2!1sen!2sin"
        className="w-full h-full border-0 rounded-2xl"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
  </div>
</div>

        </div>
      </div>
    </section>
  );
}
