import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Database, ChartPie, BarChart3, Layers, CloudCog,
  ShieldCheck, Workflow, BrainCircuit, Bot
} from "lucide-react";

type Tool = {
  name: string;
  logo: string;
  category: string;
  icon?: React.ReactNode;
};

const tools: Tool[] = [
  { name: "Python", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg", category: "Data Processing & Analytics", icon: <BarChart3 className="h-5 w-5 text-blue-500" /> },
  { name: "R", logo: "https://www.r-project.org/logo/Rlogo.svg", category: "Data Processing & Analytics", icon: <BarChart3 className="h-5 w-5 text-blue-500" /> },
  { name: "TensorFlow", logo: "https://www.tensorflow.org/images/tf_logo_social.png", category: "ML & AI", icon: <BrainCircuit className="h-5 w-5 text-blue-500" /> },
  { name: "Scikit-learn", logo: "https://scikit-learn.org/stable/_static/scikit-learn-logo-small.png", category: "ML & AI", icon: <BrainCircuit className="h-5 w-5 text-blue-500" /> },
  { name: "Apache Hadoop", logo: "https://www.apache.org/logos/res/hadoop/hadoop.png", category: "Big Data", icon: <Layers className="h-5 w-5 text-blue-500" /> },
  { name: "Apache Spark", logo: "https://spark.apache.org/images/spark-logo-trademark.png", category: "Big Data", icon: <Layers className="h-5 w-5 text-blue-500" /> },
  { name: "Google BigQuery", logo: "https://images.icon-icons.com/2699/PNG/512/google_bigquery_logo_icon_168150.png", category: "Big Data", icon: <Layers className="h-5 w-5 text-blue-500" /> },
  { name: "Amazon Redshift", logo: "https://logowik.com/content/uploads/images/aws-redshift2026.jpg", category: "Data Warehousing", icon: <Database className="h-5 w-5 text-blue-500" /> },
  { name: "Snowflake", logo: "https://www.snowflake.com/wp-content/themes/snowflake/assets/img/logo-blue.svg", category: "Data Warehousing", icon: <Database className="h-5 w-5 text-blue-500" /> },
  { name: "Microsoft Azure Synapse", logo: "https://azure.microsoft.com/svghandler/synapse-analytics/?width=300&height=300", category: "Data Warehousing", icon: <Database className="h-5 w-5 text-blue-500" /> },
  { name: "Tableau", logo: "https://www.tableau.com/sites/default/files/pages/tableau_cmyk_2015.png", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "Power BI", logo: "https://powerbi.microsoft.com/pictures/application-logos/svg/powerbi.svg", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "Qlik Sense", logo: "https://w7.pngwing.com/pngs/370/530/png-transparent-round-green-and-white-logo-qlik-business-intelligence-software-dashboard-logo-others-miscellaneous-company-grass-thumbnail.png", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "D3.js", logo: "https://d3js.org/logo.svg", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "Plotly", logo: "https://avatars.githubusercontent.com/u/5997976?s=280&v=4", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "Google Data Studio", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzBxBhM8DcLTdlVVtzyr3IU_6-G8FmCGgSMA&s", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "Crystal Reports", logo: "https://mma.prnewswire.com/media/701880/SAP_Crystal_Solutions_Logo.jpg", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "SAP BusinessObjects", logo: "https://www.sap.com/dam/application/shared/logos/sap-logo-svg.svg", category: "BI & Visualization", icon: <ChartPie className="h-5 w-5 text-blue-500" /> },
  { name: "UiPath", logo: "data:image/png;base64,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", category: "Automation", icon: <Bot className="h-5 w-5 text-blue-500" /> },
  { name: "Automation Anywhere", logo: "https://www.automationanywhere.com/sites/default/files/images/AAI/automation-anywhere-logo-a-only.png", category: "Automation", icon: <Bot className="h-5 w-5 text-blue-500" /> },
  { name: "Blue Prism", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKZorGQxOueKKOiSJViVEpk1CgOwTgZFs6VA&s", category: "Automation", icon: <Bot className="h-5 w-5 text-blue-500" /> },
  { name: "Zapier", logo: "https://cdn.freebiesupply.com/logos/large/2x/zapier-logo-svg-vector.svg", category: "Automation", icon: <Workflow className="h-5 w-5 text-blue-500" /> },
  { name: "Power Automate", logo: "https://img.icons8.com/fluent/512/microsoft-power-automate-2020.png", category: "Automation", icon: <Workflow className="h-5 w-5 text-blue-500" /> },
  { name: "Integromat", logo: "https://play-lh.googleusercontent.com/48jrCqrPKi0Af5z9gMVGVVap1EEfswtQuwh9tAdF7nL478jKzg2i9KiC6b2NMMoSaVM=w240-h480-rw", category: "Automation", icon: <Workflow className="h-5 w-5 text-blue-500" /> },
  { name: "BPMN", logo: "data:image/png;base64,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", category: "Automation", icon: <Workflow className="h-5 w-5 text-blue-500" /> },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", category: "Cloud", icon: <CloudCog className="h-5 w-5 text-blue-500" /> },
  { name: "Microsoft Azure", logo: "https://azure.microsoft.com/svghandler/azure/?width=300&height=300", category: "Cloud", icon: <CloudCog className="h-5 w-5 text-blue-500" /> },
  { name: "Google Cloud Platform", logo: "https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png", category: "Cloud", icon: <CloudCog className="h-5 w-5 text-blue-500" /> },
  // { name: "GDPR Compliance", logo: "https://st3.depositphotos.com/9215172/19228/v/450/depositphotos_192280616-stock-illustration-gdpr-general-data-protection-regulation.jpg", category: "Security & Governance", icon: <ShieldCheck className="h-5 w-5 text-blue-500" /> },
  // { name: "HIPAA Compliance", logo: "https://www.hhs.gov/sites/default/files/hipaa-simplification-image.jpg", category: "Security & Governance", icon: <ShieldCheck className="h-5 w-5 text-blue-500" /> },
  // { name: "Collibra", logo: "https://www.collibra.com/wp-content/themes/collibra/assets/images/collibra-logo.svg", category: "Security & Governance", icon: <ShieldCheck className="h-5 w-5 text-blue-500" /> },
  // { name: "Alation", logo: "https://www.alation.com/wp-content/themes/alation/img/logo.svg", category: "Security & Governance", icon: <ShieldCheck className="h-5 w-5 text-blue-500" /> },
  
];

const categories = ["All", "Data Processing & Analytics", "Big Data", "Data Warehousing", "BI & Visualization", "ML & AI", "Automation", "Cloud"];

const ToolsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredTools = activeCategory === "All"
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="tools" className="py-16 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-2" data-aos="fade-right" data-aos-delay={`${200}`}>Tools We Use</h2>
        <p className="text-gray-600 mb-8 max-w-3xl" data-aos="fade-right" data-aos-delay={`${300}`}>
          We leverage industry-leading tools and technologies to deliver exceptional data solutions tailored to your business needs.
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={cn(
                "px-4 py-2 rounded-full font-medium transition-colors",
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              )}
              data-aos="fade-up" data-aos-delay={`${300}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredTools.map((tool, index) => (
            <div
              key={index}
              className={cn(
                "bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all h-48",
              )}
              data-aos="fade-up" data-aos-delay={`${index*100+300}`}

            >
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-center text-gray-800 font-medium text-sm">{tool.name}</h3>
              <span className="text-xs text-gray-500 mt-1 text-center">{tool.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
