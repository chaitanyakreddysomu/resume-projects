import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ExpertiseItem = {
  title: string;
  description: string;
  details: {
    title: string;
    description: string;
    tools?: string[];
  }[];
};

const expertiseData: ExpertiseItem[] = [
  {
    title: "Data Analytics Tools & Expertise",
    description: "We utilize the latest data analytics technologies to help you uncover meaningful insights from your data. Our expertise includes:",
    details: [
      {
        title: "Advanced Analytics & Machine Learning",
        description: "Using tools like Python, R, TensorFlow, and Scikit-learn, we build predictive models and statistical analyses that help you forecast future trends and make data-driven decisions.",
        tools: ["Python", "R", "TensorFlow", "Scikit-learn"]
      },
      {
        title: "Data Mining",
        description: "We use techniques like clustering, classification, and regression to discover hidden patterns and insights in large datasets.",
      },
      {
        title: "Big Data Platforms",
        description: "Expertise in working with platforms like Apache Hadoop, Spark, and Google BigQuery to process and analyze vast amounts of data efficiently.",
        tools: ["Apache Hadoop", "Spark", "Google BigQuery"]
      },
      {
        title: "Data Warehousing",
        description: "Proficient in building and managing data warehouses using tools such as Amazon Redshift, Snowflake, and Microsoft Azure Synapse for fast, scalable data storage and retrieval.",
        tools: ["Amazon Redshift", "Snowflake", "Microsoft Azure Synapse"]
      }
    ]
  },
  {
    title: "Business Intelligence (BI) Tools & Expertise",
    description: "Our BI solutions enable organizations to access real-time, actionable insights through powerful visualizations and reports. We are highly skilled in:",
    details: [
      {
        title: "BI Dashboard Development",
        description: "Using Tableau, Power BI, and Qlik Sense, we create customized, interactive dashboards that help stakeholders track key metrics and KPIs at a glance.",
        tools: ["Tableau", "Power BI", "Qlik Sense"]
      },
      {
        title: "Data Visualization",
        description: "Expertise in tools like D3.js, Plotly, and Google Data Studio for creating compelling visualizations that make complex data easy to understand and act upon.",
        tools: ["D3.js", "Plotly", "Google Data Studio"]
      },
      {
        title: "BI Integration & Reporting",
        description: "We integrate data from various sources (CRM, ERP, databases) into unified BI platforms for cohesive reporting. Tools like Power BI, Crystal Reports, and SAP BusinessObjects help automate the generation of reports.",
        tools: ["Power BI", "Crystal Reports", "SAP BusinessObjects"]
      },
      {
        title: "Self-Service BI",
        description: "We implement self-service BI tools that empower business users to explore data and generate reports without relying on IT.",
      }
    ]
  },
  {
    title: "Automation Tools & Expertise",
    description: "We help businesses streamline operations and enhance efficiency through automation. Our expertise includes:",
    details: [
      {
        title: "Robotic Process Automation (RPA)",
        description: "We utilize tools like UiPath, Automation Anywhere, and Blue Prism to automate repetitive, time-consuming tasks, increasing operational efficiency.",
        tools: ["UiPath", "Automation Anywhere", "Blue Prism"]
      },
      {
        title: "Workflow Automation",
        description: "With platforms like Zapier, Power Automate, and Integromat, we streamline complex workflows, eliminating manual intervention and reducing errors.",
        tools: ["Zapier", "Power Automate", "Integromat"]
      },
      {
        title: "AI-Powered Automation",
        description: "We integrate Artificial Intelligence and Machine Learning into automation processes to drive smarter, data-driven decision-making and optimize business processes.",
      },
      {
        title: "Process Optimization",
        description: "Using BPMN (Business Process Model and Notation) tools and techniques, we design and implement optimized processes that reduce costs and improve productivity.",
        tools: ["BPMN"]
      }
    ]
  },
  {
    title: "Cloud-Based Solutions",
    description: "We specialize in leveraging cloud-based platforms to provide scalable and flexible data solutions. Our expertise includes:",
    details: [
      {
        title: "Cloud Data Storage & Management",
        description: "We work with Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) to store and manage large datasets securely.",
        tools: ["AWS", "Microsoft Azure", "Google Cloud Platform (GCP)"]
      },
      {
        title: "Cloud BI Solutions",
        description: "We deploy Power BI, Tableau, and Google Data Studio on the cloud, allowing you to access real-time insights from anywhere, on any device.",
        tools: ["Power BI", "Tableau", "Google Data Studio"]
      },
      {
        title: "Cloud Automation",
        description: "We leverage cloud-based automation tools to streamline and optimize your operations, ensuring smooth, scalable, and cost-effective solutions.",
      }
    ]
  },
  {
    title: "Security & Data Governance Expertise",
    description: "We ensure that your data is protected and managed according to industry standards:",
    details: [
      {
        title: "Data Security",
        description: "We apply best practices for securing sensitive data using encryption, access controls, and compliance with standards such as GDPR and HIPAA.",
        tools: ["GDPR", "HIPAA"]
      },
      {
        title: "Data Governance",
        description: "Expertise in implementing data governance frameworks with tools like Collibra and Alation to ensure data quality, accuracy, and compliance across your organization.",
        tools: ["Collibra", "Alation"]
      }
    ]
  }
];

const ExpertiseSection = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleItem = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter(item => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

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
      id="expertise"
      className="py-16 bg-blue-50"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Tools and Expertise</h2>
        
        <div className="mb-8 max-w-4xl">
          <p className="text-gray-700">
            As a seasoned Data Analytics, Business Intelligence (BI), and Automation company, we help businesses transform their data into insightful, interactive dashboards and visualizations. Our expertise spans across data management, reporting, and visualization, empowering organizations to make confident, data-driven decisions.
          </p>
        </div>

        <div className="space-y-4">
          {expertiseData.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300",
                isVisible ? "animate-fade-in" : "opacity-0"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-xl font-semibold text-blue-800">{item.title}</h3>
                <div className="text-blue-600">
                  {expandedItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  expandedItems.includes(index) ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  
                  <div className="space-y-4">
                    {item.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="ml-2 border-l-2 border-blue-400 pl-4">
                        <h4 className="text-lg font-medium text-blue-700 mb-2">→ {detail.title}</h4>
                        <p className="text-gray-600 mb-2">{detail.description}</p>
                        
                        {detail.tools && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {detail.tools.map((tool, toolIndex) => (
                              <span 
                                key={toolIndex} 
                                className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
