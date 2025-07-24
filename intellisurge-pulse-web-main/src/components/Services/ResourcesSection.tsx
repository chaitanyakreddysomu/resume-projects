import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ResourceItem = {
  title: string;
  description: string;
  icon?: string;
  content?: string;
  subItems?: {
    title: string;
    description?: string;
  }[];
};

const resourceItems: ResourceItem[] = [
  {
    title: "Data Analytics",
    description: "Data Analytics is essential for businesses to derive actionable insights from the massive amounts of data they collect every day. By examining data, businesses can improve operational efficiencies, make informed decisions, and uncover hidden opportunities.",
    content: "Our data analytics services are designed to address the needs of diverse industries and applications.",
    subItems: [
      { 
        title: "Descriptive Analytics",
        description: "We analyze past data to reveal trends, patterns, and historical behaviors, which help organizations understand past performance. These insights allow businesses to make informed decisions about future strategies."
      },
      { 
        title: "Predictive Analytics",
        description: "By using machine learning and statistical models, we forecast future trends and behaviors, such as customer demand, sales projections, and inventory management. This empowers businesses to take proactive steps based on data-driven predictions."
      },
      { 
        title: "Prescriptive Analytics",
        description: "Using optimization algorithms and modeling techniques, we recommend actionable steps to improve business outcomes. For instance, if predictive analytics suggests a downturn in sales, prescriptive analytics can suggest changes to marketing or pricing strategies."
      },
      { 
        title: "Data Visualization",
        description: "We provide interactive, easy-to-understand visualizations through dashboards, charts, and graphs. This allows business leaders and stakeholders to interpret complex data effortlessly, enhancing decision-making processes."
      },
      { 
        title: "Real-time Analytics",
        description: "Real-time data analysis enables businesses to take immediate action. With IoT devices, sensors, and live data feeds, we help companies continuously monitor and act on emerging trends, ensuring real-time responses to changing conditions."
      },
      { 
        title: "Big Data Analytics",
        description: "With the increasing volume of data, big data analytics allows organizations to process and analyze vast datasets quickly and efficiently. We leverage advanced technologies such as Hadoop, Spark, and NoSQL databases to manage and analyze big data."
      },
      { 
        title: "Data Mining",
        description: "We use data mining techniques to explore large datasets for patterns and correlations. This helps uncover hidden insights such as customer behavior, market trends, and potential risks."
      },
      { 
        title: "Data Integration",
        description: "Our solutions integrate data from various sources—whether it's customer data, market data, or operational data—into a unified platform for better insights. This helps in creating a holistic view of the business."
      },
      { 
        title: "Customer Analytics",
        description: "We help organizations analyze customer behavior, segment audiences, and create personalized marketing strategies that improve engagement, loyalty, and conversion rates."
      },
      { 
        title: "Operational Analytics",
        description: "By analyzing operational data, we identify inefficiencies, optimize workflows, and streamline processes. This leads to cost savings and improved productivity across the business."
      },
    ]
  },
  {
    title: "Business Intelligence (BI)",
    description: "Business Intelligence (BI) encompasses the processes, technologies, and tools that convert raw data into valuable insights for decision-making. BI solutions help organizations monitor business performance, assess competitive standing, and optimize processes through real-time data analytics.",
    content: "IntelliSurge Technologies offers a range of BI solutions that empower businesses to unlock the full potential of their data and improve operational efficiency.",
    subItems: [
      { 
        title: "Data Warehousing", 
        description: "We centralize business data into a secure and efficient data warehouse, where data from multiple sources is stored in a structured manner. This ensures businesses can access clean, reliable data for analysis."
      },
      { 
        title: "ETL (Extract, Transform, Load)", 
        description: "We help organizations extract data from various sources, transform it into a format suitable for analysis, and load it into databases for efficient querying and reporting. This process is vital for creating an accurate and actionable business intelligence system."
      },
      { 
        title: "Custom Reporting and Dashboards", 
        description: "We design and develop tailored reports and interactive dashboards that provide real-time insights into key metrics, KPIs, and business performance. These dashboards empower teams at all levels to make informed decisions quickly."
      },
      { 
        title: "Data Modeling", 
        description: "Our BI experts create optimized data models that enhance data storage, analysis, and reporting. This includes creating relational models, OLAP cubes, and dimensional models to improve data accessibility and retrieval speed."
      },
      { 
        title: "Ad-hoc Reporting", 
        description: "We provide flexible, customizable reporting solutions, allowing business users to create reports based on their unique needs and requirements without relying on IT resources."
      },
      { 
        title: "Self-Service BI", 
        description: "We enable business users to access and analyze data without requiring technical expertise. This promotes data-driven decision-making across the organization, as employees can independently generate insights and reports."
      },
      { 
        title: "Business Performance Management", 
        description: "Our BI solutions include performance management tools that track business objectives, assess team progress, and identify areas for improvement. This helps businesses stay on track toward achieving their strategic goals."
      },
      { 
        title: "Predictive Analytics Integration", 
        description: "We combine BI with predictive analytics to provide future-focused insights. By analyzing historical data and using advanced algorithms, businesses can anticipate future trends and market shifts."
      },
      { 
        title: "Mobile BI", 
        description: "With mobile BI solutions, we make it easy for employees to access real-time reports and dashboards on smartphones and tablets. This ensures that critical data is always at hand, whether in the office or on the go."
      },
      { 
        title: "BI Strategy and Consultation", 
        description: "We offer strategic BI consulting services to help businesses design and implement BI systems that align with their goals. This includes determining the right BI tools, frameworks, and technologies for a business's specific needs."
      },
    ]
  },
  {
    title: "Automation Solutions",
    description: "Automation Solutions have the potential to revolutionize business processes by eliminating manual, repetitive tasks and optimizing workflows. By automating key operations, businesses can reduce costs, increase efficiency, and minimize human error.",
    content: "IntelliSurge Technologies specializes in providing end-to-end automation services, enabling businesses to streamline operations and focus on strategic growth.",
    subItems: [
      { 
        title: "Robotic Process Automation (RPA)",
        description: "We use RPA tools to automate rule-based, repetitive tasks such as data entry, invoice processing, and report generation. This reduces operational costs and frees up valuable human resources for higher-value activities."
      },
      { 
        title: "AI-Powered Automation",
        description: "Our automation solutions leverage artificial intelligence and machine learning to handle more complex tasks, such as customer service automation, predictive maintenance, and personalized marketing campaigns."
      },
      { 
        title: "Business Process Automation (BPA)",
        description: "We automate entire workflows and processes that span multiple departments. For example, automating the entire employee onboarding process or customer support ticketing system."
      },
      { 
        title: "Workflow Automation",
        description: "Our workflow automation services ensure that tasks and processes flow seamlessly across teams and departments, improving collaboration, communication, and efficiency."
      },
      { 
        title: "Intelligent Document Processing",
        description: "Using AI and automation, we streamline document-heavy tasks such as extracting data from contracts, invoices, and forms. This reduces human intervention and speeds up processing times."
      },
      { 
        title: "Automated Decision Making",
        description: "We implement decision support systems that use data, rules, and AI to automatically make business decisions, such as loan approvals, fraud detection, or inventory reordering."
      },
      { 
        title: "Cloud Automation",
        description: "We automate cloud resource provisioning, scaling, and management, ensuring that businesses maximize cloud infrastructure efficiency while minimizing manual intervention."
      },
      { 
        title: "AI Chatbots",
        description: "Our AI-powered chatbots can automate customer support, answer common queries, and provide 24/7 service, enhancing customer satisfaction and reducing operational costs."
      },
      { 
        title: "Automation in Marketing",
        description: "We help businesses automate their marketing processes, including email marketing, social media posting, and customer segmentation. This improves engagement while saving time and effort."
      },
      { 
        title: "Automation Testing",
        description: "In software development, we automate testing processes to ensure faster and more accurate testing, reducing bugs and improving the overall quality of software."
      },
    ]
  },
  {
    title: "Artificial Intelligence (AI) and Machine Learning Solutions",
    description: "Artificial Intelligence (AI) and Machine Learning (ML) are transforming industries by enabling businesses to automate complex tasks, improve decision-making, and deliver personalized experiences.",
    content: "IntelliSurge Technologies provides AI and ML solutions that allow businesses to leverage these cutting-edge technologies for a wide range of applications:",
    subItems: [
      { 
        title: "Natural Language Processing (NLP)",
        description: "We enable systems to understand, interpret, and generate human language through text analysis, sentiment analysis, and chatbots. NLP can be used to automate customer service, analyze customer feedback, and improve engagement."
      },
      { 
        title: "Predictive Analytics",
        description: "Using AI and ML algorithms, we predict future trends and behaviors, such as customer purchasing patterns, demand forecasting, and risk assessments."
      },
      { 
        title: "Computer Vision",
        description: "We provide machine learning models that can analyze images, videos, and visual data, enabling applications such as facial recognition, automated quality inspection, and surveillance."
      },
      { 
        title: "Recommendation Engines",
        description: "Our AI-driven recommendation engines deliver personalized suggestions for products, services, or content based on user behavior, improving customer engagement and conversion rates."
      },
      { 
        title: "Fraud Detection and Security",
        description: "Using AI and ML algorithms, we can detect unusual behavior, identify security threats, and prevent fraud in financial transactions, network security, and online platforms."
      },
      { 
        title: "Autonomous Systems",
        description: "We develop autonomous systems for industries such as transportation, manufacturing, and robotics, including self-driving cars and drones that can perform tasks without human intervention."
      },
      { 
        title: "AI in Healthcare",
        description: "We use AI to improve diagnostics, personalized treatments, and patient care in the healthcare industry. AI can analyze medical images, predict patient outcomes, and recommend treatment options."
      },
      { 
        title: "Speech Recognition",
        description: "We implement speech-to-text systems and voice assistants, enhancing user interaction and accessibility across a variety of devices."
      },
      { 
        title: "AI-Powered Automation",
        description: "We integrate AI with automation solutions to handle more advanced tasks, such as optimizing supply chains, personalized marketing, and predictive maintenance in manufacturing."
      },
      { 
        title: "Machine Learning Models",
        description: "Our experts build machine learning models that can learn from historical data and adapt to new data in real-time, optimizing business processes and decision-making."
      },
    ]
  },
  {
    title: "Cloud-based Solutions",
    description: "The adoption of cloud computing is reshaping the way businesses manage and access IT resources. By moving to the cloud, organizations can reduce costs, increase scalability, and enhance flexibility, without the need for costly on-premise infrastructure.",
    content: "IntelliSurge Technologies offers comprehensive cloud-based solutions that help businesses leverage the full potential of cloud computing.",
    subItems: [
      { 
        title: "Cloud Infrastructure Management",
        description: "We design, implement, and manage scalable and secure cloud infrastructures on platforms such as AWS, Google Cloud, and Microsoft Azure. This includes compute, storage, networking, and security configurations."
      },
      { 
        title: "Hybrid Cloud Solutions",
        description: "We enable businesses to seamlessly integrate on-premises infrastructure with cloud resources to create hybrid environments that meet both operational and regulatory requirements."
      },
      { 
        title: "Multi-Cloud Strategies",
        description: "We help businesses implement multi-cloud environments that optimize performance, reduce risk, and avoid vendor lock-in by leveraging multiple cloud providers."
      },
      { 
        title: "Cloud Security",
        description: "We implement advanced security measures, such as encryption, identity management, and firewalls, to protect sensitive data and ensure compliance with industry regulations."
      },
      { 
        title: "Disaster Recovery and Business Continuity",
        description: "We create robust cloud-based disaster recovery plans to ensure business continuity in case of system failures, cyberattacks, or natural disasters."
      },
      { 
        title: "SaaS, PaaS, and IaaS Solutions",
        description: "We provide cloud-based services for software, platforms, and infrastructure, allowing businesses to access resources on-demand and scale as needed."
      },
      { 
        title: "Cloud Analytics",
        description: "Leveraging cloud-based data storage and processing power, we deliver real-time analytics solutions that enable businesses to gain insights faster and more efficiently."
      },
      { 
        title: "Cloud DevOps",
        description: "We help businesses integrate development and operations processes in the cloud, ensuring faster and more reliable software deployment cycles."
      },
      { 
        title: "Cost Optimization",
        description: "Our cloud solutions are designed to optimize costs by right-sizing cloud resources, automating scaling, and leveraging reserved instances or spot instances where appropriate."
      },
    ]
  },
  {
    title: "Website Design and Web-based Services",
    description: "A website is often the first interaction customers have with your brand. It is crucial for businesses to have a well-designed website that is visually appealing, user-friendly, and optimized for mobile devices.",
    content: "At IntelliSurge Technologies, we provide custom website design and web-based services that help businesses establish a strong online presence and enhance user experience.",
    subItems: [
      { 
        title: "Custom Web Design",
        description: "We build tailor-made websites that align with your business goals, brand identity, and target audience, creating a seamless online experience."
      },
      { 
        title: "Responsive Design",
        description: "Our designs are optimized for all screen sizes, ensuring your website performs well on desktops, tablets, and smartphones."
      },
      { 
        title: "E-commerce Development",
        description: "We develop secure, user-friendly e-commerce websites with integrated payment systems, inventory management, and customer tracking features."
      },
      { 
        title: "Content Management Systems (CMS)",
        description: "We provide CMS platforms such as WordPress, Joomla, and Drupal, allowing businesses to manage and update their content without requiring technical expertise."
      },
      { 
        title: "Search Engine Optimization (SEO)",
        description: "Our SEO experts optimize your website's content, structure, and metadata to improve visibility in search engine results, driving more organic traffic."
      },
      { 
        title: "Website Performance Optimization",
        description: "We ensure that your website loads quickly and performs seamlessly, providing an excellent user experience that minimizes bounce rates."
      },
      { 
        title: "Website Redesign",
        description: "We help businesses revamp outdated websites to improve functionality, enhance aesthetics, and incorporate the latest web technologies."
      },
      { 
        title: "Web-based Applications",
        description: "We build custom web applications that automate processes, improve productivity, and integrate with your existing business systems."
      },
      { 
        title: "Website Security",
        description: "We implement security best practices, including SSL encryption, firewalls, and regular updates to protect your website and its users from potential threats."
      },
      { 
        title: "Maintenance and Support",
        description: "We offer ongoing website maintenance, including software updates, backups, and troubleshooting, to keep your website secure and functioning optimally."
      },
    ]
  },
  {
    title: "Web and Internet Solutions",
    description: "Web and Internet Solutions are crucial for businesses that want to improve their online visibility, reach customers, and enhance digital engagement.",
    content: "At IntelliSurge Technologies, we provide a comprehensive suite of web and internet services designed to help businesses thrive in the digital age.",
    subItems: [
      { 
        title: "Web Development",
        description: "We develop responsive, dynamic websites that offer an optimal user experience and are aligned with the latest web technologies and design trends."
      },
      { 
        title: "E-commerce Solutions",
        description: "We design and develop secure online stores with payment gateway integration, inventory management, and customer tracking systems to help businesses sell products and services effectively."
      },
      { 
        title: "Digital Marketing",
        description: "We offer online marketing services including SEO, SEM, content marketing, and social media management to increase brand visibility and drive customer engagement."
      },
      { 
        title: "Web Hosting",
        description: "We provide secure and scalable web hosting solutions tailored to meet the unique needs of businesses, including cloud hosting, dedicated servers, and shared hosting."
      },
      { 
        title: "Content Management Systems (CMS)",
        description: "We implement easy-to-use CMS platforms like WordPress, Joomla, and Drupal to allow businesses to manage and update their web content efficiently."
      },
      { 
        title: "Web Portals",
        description: "We develop custom web portals for clients, employees, and customers, enabling easy access to important information, documents, and services."
      },
      { 
        title: "API Integration",
        description: "We integrate third-party services and systems with your website or web applications, enabling seamless data flow between different platforms."
      },
      { 
        title: "Website Analytics",
        description: "We provide detailed web analytics and performance reports, helping businesses understand user behavior, traffic sources, and conversion rates to improve their online strategy."
      }
    ]
  },
  {
    title: "Internet of Things (IoT)",
    description: "The Internet of Things (IoT) is transforming how businesses interact with their customers, employees, and processes by connecting physical devices to the internet and enabling real-time data exchange.",
    content: "IntelliSurge Technologies offers innovative IoT solutions that help businesses optimize operations, improve customer experiences, and unlock new business opportunities through connected devices.",
    subItems: [
      { 
        title: "IoT Strategy and Consultation",
        description: "We provide strategic consulting services to help businesses understand how IoT can enhance their operations and identify the right technologies, devices, and platforms for their needs."
      },
      { 
        title: "IoT Device Integration",
        description: "We integrate IoT devices such as sensors, wearables, smart meters, and connected machines into your existing infrastructure to enable real-time data collection and analysis."
      },
      { 
        title: "Data Collection and Analytics",
        description: "We help businesses leverage IoT-generated data to gain valuable insights into operational performance, customer behavior, and environmental conditions. Our advanced data analytics tools provide actionable insights for optimization."
      },
      { 
        title: "IoT Platform Development",
        description: "We build custom IoT platforms that facilitate the management and monitoring of connected devices. These platforms provide a central dashboard to track device performance, collect data, and make real-time decisions."
      },
      { 
        title: "Smart Home Solutions",
        description: "We develop IoT-based smart home solutions that allow users to control appliances, security systems, and other devices remotely through mobile apps, improving convenience and energy efficiency."
      },
      { 
        title: "Smart City Solutions",
        description: "Our IoT solutions for smart cities include connected traffic systems, smart lighting, waste management, and environmental monitoring to improve urban living and sustainability."
      },
      { 
        title: "Industrial IoT (IIoT)",
        description: "We offer IoT solutions for industrial applications, including predictive maintenance, equipment monitoring, and supply chain optimization, reducing downtime and increasing productivity."
      },
      { 
        title: "IoT Security",
        description: "We ensure that IoT devices and networks are secure by implementing encryption, authentication, and monitoring solutions to protect sensitive data from cyber threats."
      },
      { 
        title: "Supply Chain Management",
        description: "We integrate IoT sensors and devices to track goods and materials in real time, optimizing inventory management, reducing theft, and improving logistics efficiency."
      },
      { 
        title: "Health IoT Solutions",
        description: "We develop IoT-based healthcare solutions that enable remote patient monitoring, wearables, and smart medical devices, improving healthcare delivery and patient outcomes."
      },
      { 
        title: "IoT-enabled Smart Retail",
        description: "We create IoT solutions that enhance retail experiences, such as personalized in-store offers, smart checkout systems, and inventory tracking."
      },
      { 
        title: "Fleet Management Solutions",
        description: "We provide IoT-based fleet management systems that monitor vehicle health, optimize routes, and track shipments in real time, improving logistics operations."
      }
    ]
  },
  {
    title: "Big Data Solutions",
    description: "Big Data refers to the vast volume of structured and unstructured data generated by businesses and consumers daily. Big Data Solutions allow organizations to process, analyze, and derive actionable insights from this data.",
    content: "IntelliSurge Technologies offers big data solutions that help businesses manage and leverage massive datasets effectively.",
    subItems: [
      { 
        title: "Big Data Strategy and Consulting",
        description: "We provide strategic consulting to help businesses define their big data goals, identify the right technologies, and create a roadmap for data management and analysis."
      },
      { 
        title: "Data Lakes and Warehousing",
        description: "We design and implement data lakes and data warehouses to store large amounts of data in a centralized, scalable, and efficient manner, making it accessible for analytics and reporting."
      },
      { 
        title: "Data Integration",
        description: "Our solutions integrate data from various sources, including social media, IoT devices, CRM systems, and transactional databases, providing a unified view of business performance."
      },
      { 
        title: "Data Processing and Cleaning",
        description: "We offer tools and techniques to cleanse, format, and transform raw data into structured, usable formats for further analysis, eliminating inconsistencies and ensuring accuracy."
      },
      { 
        title: "Real-Time Data Analytics",
        description: "We build systems that process and analyze data in real time, allowing businesses to make instant decisions and take actions based on live data feeds."
      },
      { 
        title: "Predictive Analytics",
        description: "By applying machine learning algorithms to big data, we enable businesses to forecast future trends, customer behavior, and market conditions."
      },
      { 
        title: "Data Visualization",
        description: "We use advanced visualization tools like Tableau, Power BI, and custom dashboards to present big data insights in an easily digestible format, making it easier for decision-makers to understand complex patterns."
      },
      { 
        title: "Big Data Security",
        description: "We implement robust security protocols to protect sensitive big data, including encryption, access control, and regular audits to ensure data integrity and compliance with regulations."
      },
      { 
        title: "Cloud-Based Big Data Solutions",
        description: "We leverage cloud platforms like AWS, Microsoft Azure, and Google Cloud to provide scalable and cost-effective big data storage and processing solutions."
      },
      { 
        title: "Machine Learning and AI Integration",
        description: "We integrate machine learning models and AI algorithms with big data to derive deeper insights, automate processes, and predict future outcomes."
      },
      { 
        title: "Customer Insights and Analytics",
        description: "We help businesses analyze customer data to uncover purchasing patterns, preferences, and behavior, enabling personalized marketing and improved customer experiences."
      },
      { 
        title: "Data Governance and Compliance",
        description: "We implement data governance frameworks that ensure proper data management, quality control, and adherence to industry regulations such as GDPR and HIPAA."
      }
    ]
  },
  {
    title: "Internet Portals and Media Gateways",
    description: "Internet Portals, Networks, Media Portals, and Gateways play a crucial role in delivering centralized, interactive access to information, services, and resources over the internet.",
    content: "IntelliSurge Technologies offers custom solutions that help businesses develop powerful online portals, networks, and gateways to streamline operations, engage users, and enhance accessibility.",
    subItems: [
      { 
        title: "Custom Portal Development",
        description: "We create tailored internet portals that provide easy access to information, applications, and services for businesses, customers, employees, and partners."
      },
      { 
        title: "Business Networks",
        description: "We design secure, private networks that connect employees, suppliers, and partners for seamless collaboration, communication, and data sharing."
      },
      { 
        title: "Media Portals",
        description: "We develop media portals for businesses in the media industry, allowing them to publish and distribute content like news, videos, and multimedia across platforms."
      },
      { 
        title: "Online Communities and Forums",
        description: "We build interactive online communities, forums, and social networking sites that allow users to engage, share content, and collaborate."
      },
      { 
        title: "Content Management Systems (CMS)",
        description: "Our CMS solutions enable businesses to easily create, manage, and distribute digital content across websites and portals."
      },
      { 
        title: "Gateway Development",
        description: "We develop gateways that allow users to securely access and interact with external systems, applications, or platforms, facilitating seamless data exchanges."
      },
      { 
        title: "Single Sign-On (SSO) Integration",
        description: "We implement SSO solutions that allow users to log into multiple systems and applications with a single set of credentials, improving security and user experience."
      }
    ]
  },
  {
    title: "E-commerce Solutions",
    description: "E-commerce solutions help businesses establish and manage their online stores effectively, integrating various technologies and tools to enhance user experience, increase sales, and streamline operations.",
    content: "IntelliSurge Technologies offers complete e-commerce solutions that include platforms, education, and the latest technologies to ensure success in the digital marketplace.",
    subItems: [
      { 
        title: "Custom E-commerce Platforms",
        description: "We develop fully customizable e-commerce platforms that align with your business requirements and goals, including features like multi-channel selling, product management, and order processing."
      },
      { 
        title: "E-commerce Development Frameworks",
        description: "We use the latest technologies like Magento, WooCommerce, Shopify, and BigCommerce to build scalable and secure e-commerce websites."
      },
      { 
        title: "Mobile E-commerce Solutions",
        description: "We design and develop mobile-friendly e-commerce websites and apps, ensuring seamless shopping experiences on smartphones and tablets."
      },
      { 
        title: "E-commerce Payment Solutions",
        description: "We integrate secure payment gateways for smooth transactions, offering support for credit/debit cards, PayPal, cryptocurrency, and other digital wallets."
      },
      { 
        title: "Inventory and Order Management",
        description: "We integrate robust inventory and order management systems that automate stock tracking, order processing, and shipping, saving time and reducing errors."
      },
      { 
        title: "E-commerce Education",
        description: "We provide training programs for businesses to help them optimize their e-commerce platforms, including SEO, marketing, and customer service strategies."
      },
      { 
        title: "Advanced E-commerce Technologies",
        description: "We incorporate AI, machine learning, and data analytics to offer personalized shopping experiences, product recommendations, and insights for optimizing product catalogs."
      },
      { 
        title: "E-commerce Security Solutions",
        description: "We implement security features such as SSL encryption, two-factor authentication, and fraud detection to protect online transactions and customer data."
      }
    ]
  },
  {
    title: "Web Technologies",
    description: "Web Technologies encompass the tools, platforms, and programming languages used to build websites and web applications. These technologies are crucial for ensuring that websites function smoothly, load quickly, and provide a seamless user experience.",
    content: "At IntelliSurge Technologies, we leverage the latest web technologies to build dynamic, interactive, and high-performance websites.",
    subItems: [
      { 
        title: "HTML5, CSS3, and JavaScript",
        description: "These core technologies are the foundation of modern web development, ensuring websites are responsive, interactive, and user-friendly."
      },
      { 
        title: "Front-end Frameworks",
        description: "We use popular front-end frameworks such as React, Angular, and Vue.js to create fast, interactive, and dynamic user interfaces."
      },
      { 
        title: "Back-end Development",
        description: "We build robust server-side applications using technologies like Node.js, PHP, Ruby on Rails, and Python to manage data processing, server communication, and business logic."
      },
      { 
        title: "Web APIs",
        description: "We develop and integrate custom APIs that allow web applications to interact with external services, databases, and third-party systems."
      },
      { 
        title: "Progressive Web Apps (PWAs)",
        description: "We create progressive web applications that combine the best of both web and mobile apps, offering ofline capabilities, push notifications, and fast load times."
      },
      { 
        title: "WebSockets",
        description: "For real-time communication, we use WebSockets to create interactive, live updates on websites and web apps, ideal for chat applications, live scores, and stock tickers."
      },
      { 
        title: "Content Delivery Networks (CDNs)",
        description: "To enhance website speed and reliability, we implement CDNs, ensuring that content is delivered quickly to users across the globe."
      },
      { 
        title: "Web Security",
        description: "We integrate the latest security measures into websites, including SSL encryption, two-factor authentication, and regular vulnerability scanning to ensure data privacy and protection."
      },
    ]
  },
  {
    title: "Internet and E-commerce Solutions",
    description: "In today's digital world, Internet and E-commerce Solutions are pivotal in building a strong online presence and generating sales. These solutions provide businesses with the infrastructure, tools, and technologies required to run successful online platforms.",
    content: "IntelliSurge Technologies offers tailored internet and e-commerce solutions that enable businesses to tap into the potential of the digital marketplace and deliver seamless online experiences to customers.",
    subItems: [
      { 
        title: "Custom E-commerce Website Development",
        description: "We design and develop secure, user-friendly, and scalable e-commerce platforms that enable businesses to sell products or services online. Our solutions are optimized for user engagement, conversion, and mobile responsiveness."
      },
      { 
        title: "Payment Gateway Integration",
        description: "We integrate secure, reliable, and globally recognized payment gateways like PayPal, Stripe, and credit card processing systems, enabling businesses to accept payments with ease."
      },
      { 
        title: "Online Store Management Systems",
        description: "Our e-commerce platforms come with built-in management tools that allow businesses to manage inventory, track orders, and analyze sales performance."
      },
      { 
        title: "Shopping Cart Solutions",
        description: "We offer highly functional, customizable shopping carts that provide a seamless user experience, from product selection to checkout, with advanced features like multi-currency support and automated discounts."
      },
      { 
        title: "Multi-channel E-commerce",
        description: "We integrate e-commerce systems across multiple channels, including mobile apps, social media platforms, and marketplaces like Amazon or eBay, helping businesses reach more customers."
      },
      { 
        title: "E-commerce SEO",
        description: "Our team optimizes e-commerce websites for search engines, ensuring products and services rank well in search results, driving organic traffic and improving sales."
      },
      { 
        title: "Inventory and Warehouse Management",
        description: "We integrate inventory systems into your e-commerce platform, providing real-time tracking and updates for products, shipments, and stock levels."
      },
      { 
        title: "Mobile Commerce (M-Commerce)",
        description: "We specialize in developing mobile-friendly e-commerce websites and applications, ensuring that users can shop seamlessly on any device, anytime, and anywhere."
      },
      { 
        title: "Subscription-based E-commerce Models",
        description: "We help businesses implement subscription models, which offer recurring billing options for digital services, physical products, or memberships."
      },
      { 
        title: "Marketplace Development",
        description: "We design and develop multi-vendor marketplaces where different sellers can list their products, manage their inventory, and handle transactions."
      },
      { 
        title: "E-commerce Analytics and Reporting",
        description: "We provide detailed reports and analytics that track customer behavior, product performance, and sales trends, enabling businesses to optimize their e-commerce strategies."
      },
      { 
        title: "E-commerce Marketing Automation",
        description: "Our automation tools help businesses automate marketing efforts such as personalized emails, product recommendations, and customer engagement based on user behavior and preferences."
      },
    ]
  },
  {
    title: "Internet Marketing and Promotions",
    description: "Internet Marketing and Promotions are essential for businesses looking to expand their reach, increase visibility, and engage their target audience in the digital space.",
    content: "IntelliSurge Technologies offers comprehensive internet marketing and promotional services that help businesses attract, engage, and convert potential customers through various online channels.",
    subItems: [
      { 
        title: "Search Engine Optimization (SEO)",
        description: "We optimize your website's content, structure, and backlinks to improve its ranking on search engines like Google. This helps attract more organic traffic and generate leads."
      },
      { 
        title: "Pay-Per-Click (PPC) Advertising",
        description: "We manage PPC campaigns across platforms like Google Ads, Bing, and social media to drive targeted traffic to your website. We handle keyword research, ad creation, bid management, and performance tracking."
      },
      { 
        title: "Social Media Marketing",
        description: "We develop tailored social media strategies and campaigns for platforms like Facebook, Instagram, LinkedIn, Twitter, and TikTok. Our services include content creation, community management, and paid advertising."
      },
      { 
        title: "Email Marketing",
        description: "Our email marketing campaigns are designed to nurture leads, engage customers, and increase conversions. We provide personalized content, segmentation strategies, and automated workflows for optimal results."
      },
      { 
        title: "Affiliate Marketing",
        description: "We implement affiliate programs that allow businesses to leverage third-party partners to promote their products or services, paying them a commission for successful sales or leads generated."
      },
      { 
        title: "Influencer Marketing",
        description: "We connect businesses with influencers in their niche to promote products or services through authentic and organic content, expanding reach and building brand credibility."
      },
      { 
        title: "Content Marketing",
        description: "Our content strategies include blog posts, whitepapers, eBooks, and videos designed to educate, entertain, and engage your target audience, driving organic traffic and increasing brand awareness."
      },
      { 
        title: "Video Marketing",
        description: "We create engaging video content that tells your brand's story, highlights products, and educates your audience. We optimize video content for platforms like YouTube and social media to increase visibility."
      },
      { 
        title: "Conversion Rate Optimization (CRO)",
        description: "We improve website conversion rates by analyzing user behavior and making changes to website design, content, and calls-to-action to increase the likelihood of conversions."
      },
      { 
        title: "Display Advertising",
        description: "We run targeted display ads across the internet, including banner ads, retargeting campaigns, and native ads, to reach potential customers and drive traffic back to your website."
      },
      { 
        title: "Remarketing Campaigns",
        description: "We set up remarketing strategies that target users who have previously interacted with your website, encouraging them to complete their purchase or take other desired actions."
      },
      { 
        title: "Online Reputation Management",
        description: "We monitor and manage your online reputation by responding to customer reviews, addressing negative feedback, and improving public perception through positive marketing campaigns."
      },
      { 
        title: "Digital Public Relations (PR)",
        description: "Our digital PR services help businesses build relationships with media outlets, bloggers, and journalists to promote their products, services, and brand stories."
      },
      { 
        title: "Local SEO and Marketing",
        description: "We implement local SEO strategies that optimize your online presence for local searches, ensuring that your business appears in relevant local results on Google and other search engines."
      },
    ]
  },
];

const ResourcesSection = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [expandedSubItems, setExpandedSubItems] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleSubItem = (index: number) => {
    if (expandedSubItems.includes(index)) {
      setExpandedSubItems(expandedSubItems.filter(item => item !== index));
    } else {
      setExpandedSubItems([index]);
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
      id="resources"
      className="py-16"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-10" data-aos="fade-right" data-aos-delay="200">IntelliSurge Resources</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              {resourceItems.map((item, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors",
                    activeItem === index
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-50 text-gray-700"
                  )}
                  onClick={() => setActiveItem(index)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:w-3/4">
            <div 
              className={cn(
                "bg-white rounded-lg shadow-md p-6",
                )}
                
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-4" data-aos="fade-up" data-aos-delay={`${200}`}>
                {resourceItems[activeItem].title}
              </h3>
              
              <p className="text-gray-700 mb-6" data-aos="fade-up" data-aos-delay={`${300}`}>
                {resourceItems[activeItem].description}
              </p>
              
              {resourceItems[activeItem].content && (
                <p className="text-gray-700 mb-6" data-aos="fade-up" data-aos-delay={`${400}`}>
                  {resourceItems[activeItem].content}
                </p>
              )}

              {resourceItems[activeItem].subItems && (
                <div className="space-y-3">
                  {resourceItems[activeItem].subItems.map((subItem, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                      data-aos="fade-up" data-aos-delay={`${400+index*100}`}
                    >
                      <div 
                        className={cn(
                          "flex justify-between items-center p-3 cursor-pointer",
                          expandedSubItems.includes(index) ? "bg-blue-50" : "bg-white"
                        )}
                        onClick={() => toggleSubItem(index)}
                      >
                        <h4 className="font-medium text-blue-600">{subItem.title}</h4>
                        {subItem.description && (
                          <div className="text-gray-500">
                            {expandedSubItems.includes(index) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        )}
                      </div>

                      {subItem.description && (
                        <div 
                          className={cn(
                            "overflow-hidden transition-all duration-300",
                            expandedSubItems.includes(index) 
                              ? "max-h-96 opacity-100" 
                              : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="p-3 bg-blue-50 border-t border-blue-100">
                            <p className="text-gray-600">{subItem.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {activeItem === 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100" data-aos="fade-up" data-aos-delay={`${400}`}>
                  <p className="text-blue-800 font-medium">
                    With data analytics solutions from IntelliSurge, businesses can turn raw data into a powerful resource for informed decision-making, predictive forecasting, and strategic improvements.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 text-right">
                    Last updated: April 12, 2025
                  </p>
                </div>
              )}
              
              {activeItem === 1 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    Through our comprehensive Business Intelligence solutions, IntelliSurge empowers organizations to transform data into strategic assets, enabling faster, more informed decision-making and sustained competitive advantage.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 text-right">
                    Last updated: April 12, 2025
                  </p>
                </div>
              )}
              
              {activeItem === 2 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    With automation solutions, IntelliSurge helps businesses save time, reduce costs, and improve service delivery, ultimately leading to enhanced productivity and profitability.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 text-right">
                    Last updated: April 12, 2025
                  </p>
                </div>
              )}
              
              {activeItem === 3 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    IntelliSurge's AI and ML solutions empower businesses to innovate, improve operations, and offer smarter, more efficient services.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 text-right">
                    Last updated: April 12, 2025
                  </p>
                </div>
              )}
              
              {activeItem === 4 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    With cloud-based solutions, IntelliSurge enables businesses to drive innovation, improve scalability, and enhance agility while reducing infrastructure costs and improving system performance.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 text-right">
                    Last updated: April 12, 2025
                  </p>
                </div>
              )}
              
              {activeItem === 5 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    With website design and web-based services, IntelliSurge helps businesses create a strong digital presence, engage users, and convert visitors into loyal customers.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 text-right">
                    Last updated: April 12, 2025
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
