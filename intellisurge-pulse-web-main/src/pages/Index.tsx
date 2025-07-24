
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Code, Cloud, Users, Lightbulb, Database, Computer } from 'lucide-react';
import Navigation from '../components/Navigation';
import WhatsAppButton from '../components/WhatsAppButton';
import 'flowbite/dist/flowbite.css';
import Footer from '@/components/Footer';
import { Typewriter } from 'react-simple-typewriter';
import { HiArrowRight } from 'react-icons/hi';
import { FaSquareArrowUpRight } from 'react-icons/fa6';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Testimonal from '@/components/Testimonals';
import ContactSection from '@/components/section/ContactSection';
import ProcessSection from '@/components/section/ProcessSection';
import TechSection from '@/components/section/TechSection';
import TestimonialCarousel from '@/components/Courousal/TestimonialCarousel';
import { FlowButton } from '@/components/ui/flow-button';
import { Component } from '@/components/ui/carousel';
import { MdKeyboardArrowRight } from "react-icons/md";




const Index = () => {

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedService, setSelectedService] = useState(null);



  useEffect(() => {
    // Simple scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // hero carousel images
  const images = [
    // 'Hero_Images/1.webp',
    // 'Hero_Images/2.jpg',
    'Hero_Images/8.jpg',
    'Hero_Images/3.png',
    'Hero_Images/4.png',
    'Hero_Images/5.png',
    // 'Hero_Images/6.png',
    'Hero_Images/7.png',
    'Hero_Images/9.png',
    // 'Hero_Images/10.png',
   
  ];

  const team = [
    {
      name: "JayaSri Krishna Nelluri",
      role: "CEO & Founder",
      image: "Main_team/CEO.jpg",
    },
    {
      name: "Surendra Nelluri",
      role: "Director & CSO",
      image: "Main_team/cso-1.png",

    },
    {
      name: "Naresh Appali",
      role: "Vice President",
      // image: "Main_Team/Logo_IntelliSurge_TM.png",
      image: "LogoTM.png",

    },
    {
      name: "Jay Sri",
      role: "Chief People Officer",
      image: "Main_team/JayaSri-1.jpeg",

    },
    {
      name: "Akansha Mohili",
      role: "Business Development Manager",
      image: "Main_team/akansha.jpg",

    },
    {
      name: "Dheeraj Amarachinta",
      role: "Business Development Manager",
      image: "Main_team/Dheeraj.jpg",

    },
  ];
  const getBgColorClass = (color: string) => {
    switch (color) {
      case "red-100": return "bg-red-100";
      case "blue-100": return "bg-blue-100";
      case "yellow-100": return "bg-yellow-100";
      case "green-100": return "bg-green-100";
      case "purple-100": return "bg-purple-100";
      case "pink-100": return "bg-pink-100";
      default: return "bg-blue-100";
    }
  };
    
  const getBorderColorClass = (color: string) => {
    switch (color) {
      case "red-500": return "bg-red-500";
      case "blue-500": return "bg-blue-500";
      case "yellow-500": return "bg-yellow-500";
      case "green-500": return "bg-green-500";
      case "purple-500": return "bg-purple-500";
      case "pink-500": return "bg-pink-500";
      default: return "bg-blue-500";
    }
  };


  const partners = [
    { company: "Bitwise Tech Solutions", logo: "https://bitwisetech.in/wp-content/uploads/2024/01/BitWise_Solution.png",name:"Dheeraj Guptha" },
    { company: "Reycruit", logo: "https://reycruit.com/images/logo/logo.png",name:"Shruthi Chilagani" },
    { company: "Kareer 9", logo: "https://www.kareer9.com/k9-logo.png",name:"Sushmita & Madhu" },
    { company: "Magsmen", logo: "https://magsmen.com/static/assets/img/logos/magsmen-new-version.png",name:"Sandeep" },
    { company: "Ecodelinfotel", logo: "https://www.ecodelinfotel.com/assets/img/white-logo.png",name:"Rajesh Medicheral" },
  ];



  
  const services = [
    {
      icon: <Code className="h-5 w-5 text-red-500" />,
      title: "Custom Software Development",
      description: "We create bespoke software solutions tailored to your unique business requirements. Our expert developers use cutting-edge technologies to build scalable, secure, and user-friendly applications.",
      features: ["Web Applications", "Mobile Apps", "Desktop Software", "API Development", "System Integration"],
      price: "Starting from $5,000",
      color: "red-500",
      bgColor: "red-100",
    },
   
    {
      icon: <Cloud className="h-5 w-5 text-blue-500" />,
      title: "Cloud Solutions & Migration",
      description: "Transform your infrastructure with our comprehensive cloud services. We help you migrate, optimize, and manage your cloud environment for maximum efficiency and cost savings.",
      features: ["Cloud Migration", "Infrastructure as Code", "DevOps Implementation", "Multi-cloud Strategy", "Cloud Security"],
      price: "Starting from $5,000",
      color: "blue-500",
      bgColor: "blue-100",
    },
    {
      icon: <Computer className="h-5 w-5 text-yellow-500" />,
      title: "AI & Machine Learning",
      description: "Harness the power of artificial intelligence to automate processes, gain insights, and drive innovation. Our AI solutions are designed to solve real business problems.",
      features: ["Process Automation", "Predictive Analytics", "Natural Language Processing", "Computer Vision", "Chatbots & Virtual Assistants"],
      price: "Starting from $5,000",
      color: "yellow-500",
      bgColor: "yellow-100",
    },
    {
      icon: <Database className="h-5 w-5 text-green-500" />,
      title: "Data Analytics & Business Intelligence",
      description: "Turn your data into actionable insights with our advanced analytics solutions. We help you make data-driven decisions that drive growth and efficiency.",
      features: ["Data Warehousing", "Real-time Analytics", "Dashboard Development", "Data Mining", "Reporting Solutions"],
      price: "Starting from $5,000",
      color: "green-500",
      bgColor: "green-100",
    },
    {
      icon: <Users className="h-5 w-5 text-purple-500" />,
      title: "UI/UX Design",
      description: "Create exceptional user experiences with our design expertise. We craft intuitive, beautiful interfaces that engage users and drive conversions.",
      features: ["User Research", "Wireframing & Prototyping", "Visual Design", "Usability Testing", "Design Systems"],
      price: "Starting from $5,000",
      color: "purple-500",
      bgColor: "purple-100",
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-pink-500" />,
      title: "Digital Transformation Consulting",
      description: "Navigate your digital transformation journey with expert guidance. We help you modernize your business processes and technology stack.",
      features: ["Technology Assessment", "Digital Strategy", "Process Optimization", "Change Management", "Training & Support"],
      price: "Starting from $5,000",
      color: "pink-500",
      bgColor: "pink-100",
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <WhatsAppButton />

    {/* Hero Section */}
{/* Hero Section */}
<section className="relative min-h-screen bg-gradient-to-br from-white via-blue-200 to-white overflow-hidden pt-20 pb-8 sm:pb-10 md:pb-0">
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-6 md:px-20 min-h-[calc(100vh-5rem)]">
    
    {/* Text Content - now comes first in DOM for mobile but still appears second visually */}
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-left space-y-6 md:min-h-[60vh]">
      <h1
        className="text-4xl sm:text-5xl md:text-4xl font-bold drop-shadow-lg text-gray-900"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        Your Future, Our{' '}
        <span className="text-blue-700 block sm:inline">
          <Typewriter
            words={['Vision','Mission','Code']}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={100}
            delaySpeed={1500}
          />
        </span>
      </h1>

      <p
        className="text-lg sm:text-xl md:text-lg text-gray-700"
        data-aos="fade-right"
        data-aos-delay="300"
      >
        We deliver cutting-edge solutions to propel your business forward.
      </p>

      <div className="flex justify-center md:justify-start" data-aos="fade-up" data-aos-delay="300">
        <FlowButton text="Get Started" />
      </div>
    </div>

    {/* Carousel Section - hidden on mobile */}
      <div
        className="hidden md:flex w-full md:w-1/2 justify-center items-center h-full"
        data-aos="fade-left"
        data-aos-delay="300"
      >
        <div className="w-full max-w-[600px] border-2 border-white rounded-xl shadow-xl shadow-gray-300 overflow-hidden">
          <Component images={images} baseWidth={600} />
        </div>
      </div>
  </div>
</section>







      {/* Our Process */}
      <section className="py-20">
 <ProcessSection/>
</section>


      {/* Tech Solutions */}
      <section className="py-20">
 <TechSection/>
</section>


      {/* Team Section */}
      <section className="py-20">
  <div className="max-w-7xl mx-auto px-4">
    {/* Heading */}
    <div className="text-center mb-16">
      <h2
        className="text-3xl font-bold text-gray-900 mb-2"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Meet Our Brilliant Team
      </h2>
      <p
        className="text-lg text-gray-600"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        The talented individuals behind IntelliSurge’s success
      </p>
    </div>

    {/* Team Grid */}
    <div className="flex flex-wrap justify-center gap-6 " >
      {team.map((member, index) => (
        <div
          key={index}
          // className="relative w-[250px] h-[320px] rounded-2xl overflow-hidden shadow-lg group "
          className="relative w-[250px] h-[320px] overflow-hidden shadow-lg group cursor-none rounded-tl-3xl rounded-tr-none  rounded-bl-none rounded-br-3xl hover:border-blue-700
            
           border-2"

          data-aos="fade-up"
          data-aos-delay={300 + index * 200}
        >
          {/* Full Image */}
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Text */}
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h3 className="text-lg font-semibold drop-shadow">{member.name}</h3>
            <p className="text-sm text-gray-200 drop-shadow">{member.role}</p>
          </div>

          {/* Optional dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300" />
        </div>
      ))}
    </div>
  </div>
</section>






{/* Services Grid */}
<section className="py-20">
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    <div className="text-center mb-16 animate-on-scroll">
      <h2
        className="text-4xl font-bold text-gray-900 mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Our Services
      </h2>
      
      <p
        className="text-xl text-gray-600 mb-8"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        From custom software development to AI automation, we offer comprehensive technology solutions
      that drive innovation and growth for businesses of all sizes.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
      {services.slice(0, 6).map((value, index) => (
        <div
          key={index}
          // className="relative  border-gray-700 rounded-none p-6 bg-white transition-all duration-300 group min-h-[200px]"
          className="relative  border-red-200  p-6 bg-white transition-all duration-300 group min-h-[200px]"

          data-aos="fade-up"
          data-aos-delay={`${index * 200}`}
          style={{ borderColor: `var(--tw-border-opacity, 1)` }} // override border color below dynamically
        >
          {/* Icon Box with dynamic bg color */}
          <div
  className={`absolute -top-5 -left-5 p-3 rounded-lg shadow-sm z-10 ${getBgColorClass(value.bgColor)}`}
>
  {value.icon}
</div>


          {/* Animated border lines with dynamic color */}
          {/* Top horizontal line */}
          <div
            className={`absolute top-0 left-[-20px] h-0.5 origin-left scale-x-0
              group-hover:scale-x-100 transition-transform duration-500 ease-in-out delay-100 ${getBorderColorClass(value.color)}`}
            style={{ width: "calc(100% + 20px)" }}
          ></div>

          {/* Left vertical line */}
          <div
            className={`absolute top-[-20px] left-0 w-0.5 origin-top scale-y-0
              group-hover:scale-y-100 transition-transform duration-500 ease-in-out delay-100 ${getBorderColorClass(value.color)}`}
            style={{ height: "calc(100% + 20px)" }}
          ></div>

          {/* Bottom horizontal line */}
          <div
            className={`absolute bottom-0 left-0 h-0.5 origin-left scale-x-0
              group-hover:scale-x-100 transition-transform duration-500 ease-in-out delay-200 ${getBorderColorClass(value.color)}`}
            style={{ width: "100%" }}
          ></div>

          {/* Right vertical line */}
          <div
            className={`absolute top-0 right-0 w-0.5 origin-top scale-y-0
              group-hover:scale-y-100 transition-transform duration-500 ease-in-out delay-150 ${getBorderColorClass(value.color)}`}
            style={{ height: "100%" }}
          ></div>


          {/* Content */}
          <div className="pt-6 text-left relative z-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1 overflow-hidden">
              {value.features.slice(0, 3).map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setSelectedService(value)}
            className="mt-3 text-xs text-black self-start"
          >
            View More 
          </button>
        </div>
        
      ))}
    </div>
  </div>
  {selectedService && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className={`${getBgColorClass(selectedService.bgColor)} rounded-lg shadow-lg max-w-md w-full p-6 relative overflow-y-auto max-h-[90vh] animate-fade-in`}>
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
            onClick={() => setSelectedService(null)}
          >
            ×
          </button>

          <div className="text-center mb-4">
            <div className=" mb-2" data-aos="fade-right">{selectedService.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2" data-aos="fade-up">{selectedService.title}</h3>
            <p className="text-sm text-gray-600 mb-4" data-aos="fade-up">{selectedService.description}</p>
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2" data-aos="fade-right">Features:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
            {selectedService.features.map((feature, i) => (
              <li key={i} data-aos="fade-right" data-aos-delay={i * 100}>{feature}</li>
            ))}
          </ul>

          {/* <div className="text-right text-black font-semibold" data-aos="fade-left">
            {selectedService.price}
          </div> */}
        </div>
      </div>
    )}
  <div className="flex justify-center mt-5" data-aos="fade-up" data-aos-delay="600">
      <a
        href="/services"
        className="group flex items-center px-1 py-1  text-base font-semibold rounded-sm  text-black/70 hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-lg focus:outline-none relative overflow-hidden"
      >
        <span className="ml-3">View More </span>
        <span className="icon-arrow transform scale-[0.5] transition-all duration-500 group-hover:ml-4">
          <svg
            width="33"
            height="22"
            viewBox="0 0 66 43"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="arrow" fill="none">
              <path
                id="arrow-icon-one"
                d="M40.15 3.89L43.98 0.14C44.17 -0.05 44.48 -0.05 44.68 0.14L65.69 20.78C66.09 21.17 66.09 21.81 65.7 22.2L44.68 42.86C44.48 43.05 44.17 43.05 43.98 42.86L40.15 39.11C39.96 38.91 39.95 38.6 40.15 38.4L56.99 21.86C57.19 21.66 57.19 21.35 57 21.15L40.15 4.61C39.96 4.41 39.95 4.1 40.15 3.9Z"
                className="arrow-fill"
              />
              <path
                id="arrow-icon-two"
                d="M20.15 3.89L23.98 0.14C24.17 -0.05 24.48 -0.05 24.68 0.14L45.69 20.78C46.09 21.17 46.09 21.81 45.7 22.2L24.68 42.86C24.48 43.05 24.17 43.05 23.98 42.86L20.15 39.11C19.96 38.91 19.95 38.6 20.15 38.4L36.99 21.86C37.19 21.66 37.19 21.35 37 21.15L20.15 4.61C19.96 4.41 19.95 4.1 20.15 3.9Z"
                className="arrow-fill"
              />
              <path
                id="arrow-icon-three"
                d="M0.15 3.89L3.98 0.14C4.17 -0.05 4.48 -0.05 4.68 0.14L25.69 20.78C26.09 21.17 26.09 21.81 25.7 22.2L4.68 42.86C4.48 43.05 4.17 43.05 3.98 42.86L0.15 39.11C-0.04 38.91 -0.05 38.6 0.15 38.4L16.99 21.86C17.19 21.66 17.19 21.35 17 21.15L0.15 4.61C-0.04 4.41 -0.05 4.1 0.15 3.9Z"
                className="arrow-fill"
              />
            </g>
          </svg>
        </span>
      </a>
    </div>
</section>

{/* Services Grid */}


      {/* Testimonials */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="200">What Our Clients Say</h2>
            <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="300">Real feedback from satisfied customers</p>
          </div>
          
          <TestimonialCarousel/>
        </div>
      </section>
{/* <section className="py-20 ">
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className="text-center mb-16 animate-on-scroll">
          <h2
            className="text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            IntelliSurge Blogs
          </h2>
          <p
            className="text-xl text-gray-600"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Latest insights and industry trends
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {blogs.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
              data-aos="fade-up"
              data-aos-delay={500 + index * 150}
            >
              <div className="flex justify-between items-start p-6 h-44">
                <div className="w-4/5">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-1 truncate"
                    title={article.title}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm text-gray-600 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={article.excerpt}
                  >
                    {article.excerpt}
                  </p>
                </div>
                <div className="w-1/5 flex justify-end">
                  <button
                    className="w-9 h-9 rounded-full border border-gray-300 shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                    aria-label="Read more"
                    onClick={() => setSelectedBlog(article)}
                  >
                    <FaSquareArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <img
                src={article.image}
                alt={article.title}
                className="w-full h-44 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-5" data-aos="fade-up" data-aos-delay="600">
      <a
        href="/blogs"
        className="group flex items-center px-1 py-1  text-base font-semibold rounded-sm  text-black/70 hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-lg focus:outline-none relative overflow-hidden"
      >
        <span className="ml-3">View More</span>
        <span className="icon-arrow transform scale-[0.5] transition-all duration-500 group-hover:ml-4">
          <svg
            width="33"
            height="22"
            viewBox="0 0 66 43"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="arrow" fill="none">
              <path
                id="arrow-icon-one"
                d="M40.15 3.89L43.98 0.14C44.17 -0.05 44.48 -0.05 44.68 0.14L65.69 20.78C66.09 21.17 66.09 21.81 65.7 22.2L44.68 42.86C44.48 43.05 44.17 43.05 43.98 42.86L40.15 39.11C39.96 38.91 39.95 38.6 40.15 38.4L56.99 21.86C57.19 21.66 57.19 21.35 57 21.15L40.15 4.61C39.96 4.41 39.95 4.1 40.15 3.9Z"
                className="arrow-fill"
              />
              <path
                id="arrow-icon-two"
                d="M20.15 3.89L23.98 0.14C24.17 -0.05 24.48 -0.05 24.68 0.14L45.69 20.78C46.09 21.17 46.09 21.81 45.7 22.2L24.68 42.86C24.48 43.05 24.17 43.05 23.98 42.86L20.15 39.11C19.96 38.91 19.95 38.6 20.15 38.4L36.99 21.86C37.19 21.66 37.19 21.35 37 21.15L20.15 4.61C19.96 4.41 19.95 4.1 20.15 3.9Z"
                className="arrow-fill"
              />
              <path
                id="arrow-icon-three"
                d="M0.15 3.89L3.98 0.14C4.17 -0.05 4.48 -0.05 4.68 0.14L25.69 20.78C26.09 21.17 26.09 21.81 25.7 22.2L4.68 42.86C4.48 43.05 4.17 43.05 3.98 42.86L0.15 39.11C-0.04 38.91 -0.05 38.6 0.15 38.4L16.99 21.86C17.19 21.66 17.19 21.35 17 21.15L0.15 4.61C-0.04 4.41 -0.05 4.1 0.15 3.9Z"
                className="arrow-fill"
              />
            </g>
          </svg>
        </span>
      </a>
    </div>
      </div>

      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-xl animate-fade-in">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedBlog.title}</h3>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 whitespace-pre-line">{selectedBlog.excerpt}</p>
          </div>
        </div>
      )}
    </section> */}



      {/* Partners */}
      <section id="partners" className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-4 md:px-6"> {/* ✅ Reduced width */}
    {/* Section Header */}
    <div className="text-center mb-10">
      <h2
        className="text-3xl md:text-4xl font-bold text-[#0D3B66] mb-3"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Our Partners & Network
      </h2>
      <p
        className="text-lg text-[#0D3B66]/80 max-w-3xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Our strategic collaborations with industry leaders enable us to provide exceptional
        solutions and services.
      </p>
    </div>

    {/* Conditional Rendering */}
    {partners.length === 0 ? (
      <p className="text-center text-[#0D3B66]/70">Loading partners...</p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-[#11B5E4]/30 bg-white"
            data-aos="fade-up"
            data-aos-delay={`${300 + index * 200}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Avatar className="h-14 w-14 mr-4 border bg-white rounded-full overflow-hidden flex items-center justify-center">
                  {partner.logo ? (
                    <AvatarImage
                      src={partner.logo}
                      alt={partner.company}
                      className="object-contain h-full w-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-[#11B5E4]/10 text-[#0D3B66] font-bold rounded-full flex items-center justify-center h-full w-full">
                      {partner.company
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-[#0D3B66]">
                    {partner.company}
                  </h3>
                  <p className="text-sm text-[#0D3B66]/70">Led by {partner.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
</section>

      {/* Contact Section */}
     <ContactSection/>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Index;
