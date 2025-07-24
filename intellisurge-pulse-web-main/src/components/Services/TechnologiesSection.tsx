
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type TechnologyCategory = {
  title: string;
  items: string[];
};

const technologies: TechnologyCategory[] = [
  {
    title: "Data Collection & Integration Technologies",
    items: [
      "ETL (Extract, Transform, Load) Tools",
      "Data Warehousing Solutions",
      "Data Lakes",
    ],
  },
  {
    title: "Data Processing & Analytics Platforms",
    items: [
      "Big Data Frameworks",
      "Data Analytics Tools",
      "Data Querying Languages",
    ],
  },
  {
    title: "Business Intelligence Tools",
    items: [
      "BI Dashboards",
      "Reporting Tools",
      "Data Visualization Tools",
    ],
  },
  {
    title: "Machine Learning & Predictive Analytics",
    items: [
      "Machine Learning Libraries",
      "Predictive Analytics Tools",
      "AI and Natural Language Processing",
    ],
  },
  {
    title: "Data Visualization & Business Analytics",
    items: [
      "Self-Service BI Tools",
      "Online Analytical Processing Tools",
    ],
  },
  {
    title: "Cloud Platforms & Data Management Solutions",
    items: [
      "Cloud Data Platforms",
      "Data Governance and Security Tools",
    ],
  },
  {
    title: "Data Mining & Statistical Analysis Tools",
    items: [
      "Data Mining Tools",
      "Statistical Analysis Tool",
    ],
  },
  {
    title: "Artificial Intelligence & Automation Tools",
    items: [
      "AI-Powered Analytics Platforms",
      "Automation Tools for Data Pipelines",
    ],
  },
  {
    title: "Data Collaboration & Sharing Tools",
    items: [
      "Collaboration Platforms for BI",
      "Data Sharing and Cloud Storage",
    ],
  },
];

const TechnologiesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="technologies" 
      className="py-16 bg-gray-50"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900" data-aos="fade-right" data-aos-delay="200">Technologies</h2>
          <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium" data-aos="fade-right" data-aos-delay="200">
            Contact us to know more
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((category, index) => (
            <div 
              key={index}
              className={cn("bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100")}
              data-aos="fade-up" data-aos-delay={`${200+index*100}`}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;
