
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import WhatsAppButton from '../components/WhatsAppButton';
import { IoBriefcase } from "react-icons/io5";
import Footer from '@/components/Footer';
import { Code, Heart, Lightbulb, Users, Briefcase, Globe } from 'lucide-react';
import { FaCheckCircle, FaRegClock, FaUserCheck, FaHandshake, FaPhoneAlt, FaLaptopCode, FaUsers } from "react-icons/fa"; 
import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineUserGroup, HiOutlineBriefcase, HiOutlineCode, HiOutlineCalendar } from "react-icons/hi";

const Careers = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
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

  const values = [
    {
      title: "Innovation",
      description: "We push boundaries and explore new frontiers in technology to solve complex problems.",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: "Collaboration",
      description: "We believe great ideas emerge when diverse minds work together in an environment of mutual respect.",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Excellence",
      description: "We strive for the highest standards in everything we do, from coding to customer service.",
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      title: "Passion",
      description: "We're genuinely excited about technology and its potential to transform lives and businesses.",
      icon: <Heart className="h-5 w-5" />
    },
    {
      title: "Impact",
      description: "We measure our success by the positive difference we make for our clients and communities.",
      icon: <Globe className="h-5 w-5" />
    },
    {
      title: "Continuous Learning",
      description: "We embrace change and constantly seek to expand our knowledge and skills.",
      icon: <Code className="h-5 w-5" />
    }
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
  const Perks = [
    {
      title: "Health & Wellness",
      description: "We push boundaries and explore new frontiers in technology to solve complex problems.",
      icon: <HiOutlineHeart className="h-5 w-5 text-red-500" />,
      color: "red-500",
      bgColor: "red-100",
    },
    {
      title: "Flexible Time Off",
      description: "Generous PTO policy to ensure you have time to rest, recharge, and explore the world.",
      icon: <HiOutlineCalendar className="h-5 w-5 text-blue-500" />,
      color: "blue-500",
      bgColor: "blue-100",
    },
    {
      title: "Learning & Development",
      description: "Annual learning budget for conferences, courses, books, and other professional development.",
      icon: <HiOutlineLightBulb className="h-5 w-5 text-yellow-500" />,
      color: "yellow-500",
      bgColor: "yellow-100",
    },
    {
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options to help you thrive both personally and professionally.",
      icon: <HiOutlineUserGroup className="h-5 w-5 text-green-500" />,
      color: "green-500",
      bgColor: "green-100",
    },
    {
      title: "Competitive Compensation",
      description: "Attractive salary packages with equity options and regular performance-based bonuses.",
      icon: <HiOutlineBriefcase className="h-5 w-5 text-purple-500" />,
      color: "purple-500",
      bgColor: "purple-100",
    },
    {
      title: "Parental Leave",
      description: "Generous parental leave policy for all parents, regardless of gender or family status.",
      icon: <HiOutlineCode className="h-5 w-5 text-pink-500" />,
      color: "pink-500",
      bgColor: "pink-100",
    }
  ];
  

  const team = [
    {
      name: "Vishnu Vardhan Reddy",
      role: "Frontend Developer",
      image: "team images/vishnu.jpg",
      quote: "The team at Intellisurge is always ready to support and uplift each other, making every challenge easier to tackle."
    },
    {
      name: "Chaitanya Kumar Reddy",
      role: "Frontend Developer",
      image: "team images/chaitu.jpg",
      quote: "Crafting seamless user experiences is my passion, but doing it with this amazing team makes it even more rewarding."
    },
    {
      name: "Sreenika",
      role: "UI/UX Designer",
      image: "team images/sreenika_v1.jpg",
      quote: "Designing with freedom and purpose at Intellisurge keeps my creativity constantly alive."
    },
    {
      name: "Samatha",
      role: "DevOps",
      image: "team images/samatha.jpg",
      quote: "At Intellisurge, every deployment feels like a win thanks to the collaborative spirit of the team."
    },
    {
      name: "Steev",
      role: "Social Media Manager",
      image: "team images/steev.png",
      quote: "Telling our story through social platforms is easy when the culture here is so inspiring."
    },
    {
      name: "Srusti",
      role: "Frontend Developer",
      image: "team images/srusti.jpg",
      quote: "Every project pushes me to grow, and I’m proud to build with such a talented group."
    },
    {
      name: "Mithun",
      role: "Data Engineer",
      image: "team images/mithun.jpg",
      quote: "Transforming data into decisions is exciting, especially with a team that values insight and innovation."
    },
    {
      name: "Sowmya",
      role: "Backend Developer",
      image: "team images/Sowmya.jpg",
      quote: "Solving complex backend problems feels rewarding when you're backed by a smart, supportive team."
    },
    {
      name: "Pranavika",
      role: "Fullstack Developer",
      image: "team images/pranavika.jpg",
      quote: "Being a fullstack dev at Intellisurge means constantly learning and growing with people who truly care."
    }
  ];

  const cardColors = [
    "bg-purple-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-blue-50",
    "bg-pink-50",
  ];
  const positions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      company_logo:"LogoTM.png",
      company:"Intellisurge Technologies",
      description: "We're looking for an experienced full-stack developer to join our growing team and work on cutting-edge projects.",
      requirements: ["5+ years experience with React and Node.js", "Experience with cloud platforms", "Strong problem-solving skills"],
      salary:"Internship",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time",
      company_logo:"LogoTM.png",
      company:"Intellisurge Technologies",
      description: "Join our design team to create beautiful, intuitive user experiences for our clients' applications.",
      requirements: ["3+ years of UI/UX design experience", "Proficiency in Figma and design systems", "Portfolio showcasing web/mobile designs"],
      salary:"Internship",

    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote / Austin",
      type: "Full-time",
      company_logo:"LogoTM.png",
      company:"Intellisurge Technologies",
      
      description: "Help us build and maintain scalable infrastructure solutions for our clients' applications.",
      requirements: ["Experience with AWS/Azure/GCP", "Knowledge of Docker and Kubernetes", "CI/CD pipeline experience"],
      salary:"Internship",

    },
    {
      title: "Data Scientist",
      department: "AI/ML",
      location: "Remote / Boston",
      type: "Full-time",
      company_logo:"LogoTM.png",
      company:"Intellisurge Technologies",

      description: "Work on exciting AI and machine learning projects to solve complex business problems.",
      requirements: ["PhD or Masters in related field", "Experience with Python and ML frameworks", "Strong statistical analysis skills"],
      salary:"10k/Month",

    }
  ];

  const hiringProcess = [
    {
      step: "1",
      title: "Application Review",
      description: "Submit your resume and cover letter. Our hiring team will review your qualifications and experience.",
      icon: <FaRegClock />
    },
    {
      step: "2",
      title: "Initial Screening",
      description: "A 30-minute phone or video call with our recruiter to discuss your background and the role.",
      icon: <FaPhoneAlt  />
    },
    {
      step: "3",
      title: "Technical Assessment",
      description: "Depending on the role, you'll complete a skills assessment or technical project.",
      icon: <FaLaptopCode />
    },
    {
      step: "4",
      title: "Team Interviews",
      description: "Meet with potential team members and managers to discuss your experience and fit for the role.",
      icon: <FaUsers />
    },
    {
      step: "5",
      title: "Decision & Offer",
      description: "We'll make a prompt decision and extend an offer to successful candidates.",
      icon: <FaCheckCircle />
    }
  ];
  

  const teamTestimonials = [
    {
      name: "Sarah Kim",
      role: "Product Manager",
      text: "The autonomy and trust given to team members here is unmatched. I've grown so much professionally.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "David Patel",
      role: "Backend Developer",
      text: "The mentorship program helped me transition into a senior role. Great investment in people!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Lisa Zhang",
      role: "Data Analyst",
      text: "Working on diverse projects keeps things exciting. Every day brings new challenges to solve.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden flex items-center">
  <div className="max-w-7xl mx-auto px-4 relative w-full">
    {/* Animated background elements */}
    <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
    <div className="absolute bottom-10 left-10 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
    
    <div className="text-center animate-on-scroll relative z-10">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" data-aos="fade-up" data-aos-delay="200">
        Join Our Journey of
        <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent" data-aos="fade-up" data-aos-delay="250">
          Growth & Innovation
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="300">
        Be part of a dynamic team that's shaping the future of technology. We're looking for passionate individuals who thrive on challenges and want to make a real impact.
      </p>
      {/* <div data-aos="fade-up" data-aos-delay="400">
        <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Explore Opportunities
        </button>
      </div> */}
    </div>
  </div>
</section>


      {/* Culture & Values */}
      <section className="py-20">
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    <div className="text-center mb-16 animate-on-scroll">
      <h2
        className="text-4xl font-bold text-gray-900 mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Our Culture & Values
      </h2>
      <p
        className="text-xl text-gray-600"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        The principles that guide everything we do
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
      {values.map((value, index) => (
        <div
          key={index}
          className="relative border border-gray-200 rounded-xl p-6 bg-white transition-all duration-300 group min-h-[200px]"
          data-aos="fade-up"
          data-aos-delay={`${index * 200}`}
        >
          {/* Icon Box */}
          <div className="absolute -top-5 -left-5 bg-blue-100 p-3 rounded-lg text-blue-600 shadow-sm z-10">
            {value.icon}
          </div>

          {/* Animated border lines */}

          {/* Horizontal top line: starts left behind icon, animates right */}
          {/* Top horizontal line (starts immediately) */}
<div
  className="absolute top-0 left-[-20px] h-0.5 bg-blue-500 origin-left scale-x-0
    group-hover:scale-x-100 transition-transform duration-500 ease-in-out delay-100"
  style={{ width: "calc(100% + 20px)" }}
></div>

{/* Left vertical line (starts immediately) */}
<div
  className="absolute top-[-20px] left-0 w-0.5 bg-blue-500 origin-top scale-y-0
    group-hover:scale-y-100 transition-transform duration-500 ease-in-out delay-100"
  style={{ height: "calc(100% + 20px)" }}
></div>

{/* Bottom horizontal line (starts after left reaches bottom) */}
<div
  className="absolute bottom-0 left-0 h-0.5 bg-blue-500 origin-left scale-x-0
    group-hover:scale-x-100 transition-transform duration-500 ease-in-out delay-200"
  style={{ width: "100%" }}
></div>

{/* Right vertical line (starts after top & bottom reach right edge) */}
<div
  className="absolute top-0 right-0 w-0.5 bg-blue-500 origin-top scale-y-0
    group-hover:scale-y-100 transition-transform duration-500 ease-in-out delay-150"
  style={{ height: "100%" }}
></div>


          {/* Content */}
          <div className="pt-6 text-left relative z-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
            <p className="text-sm text-gray-600">{value.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>




      {/* Meet Our Team */}
      <section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    {/* Section Heading */}
    <div className="text-center mb-16" data-aos="fade-up">
      <h2 className="text-4xl font-bold text-gray-900">Meet Our Team</h2>
      <p className="text-gray-500 mt-2">Simple. Passionate. Human.</p>
    </div>

    {/* Team Grid */}
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12">
      {team.map((member, index) => (
      <div
      key={index}
      className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between overflow-hidden border border-gray-200 transition-all duration-300 hover:border-blue-300 hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
      data-aos="fade-up"
      data-aos-delay={`${index * 200}`}
    >
    
      
     
       {/* Card Content (z-10 to stay above borders) */}
       <div className="relative z-10">
         {/* Avatar and Name */}
         <div className="flex items-center mb-4">
           <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 shadow-md">
             <img
               src={member.image}
               alt={member.name}
               className="w-full h-full object-cover"
             />
           </div>
           <div className="ml-4">
             <h3 className="text-lg font-medium text-gray-800">{member.name}</h3>
             <p className="text-sm text-blue-600">{member.role}</p>
           </div>
         </div>
     
         {/* Quote */}
         <p className="text-sm text-gray-500 italic">“{member.quote}”</p>
       </div>
     </div>
     
      ))}
    </div>
  </div>
</section>


      {/* Open Positions */}
      {/* <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay='200'>Open Positions</h2>
          <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay='300'>Find your next opportunity with us</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {positions.map((position, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              data-aos="fade-up" data-aos-delay={400+index*200}
            >
              <div
                className={`relative aspect-square ${cardColors[index % cardColors.length]} flex flex-col items-center justify-center text-center`}
                
              >
                <div className="absolute top-4 left-4 text-sm text-gray-700 font-medium">{position.salary}/hr</div>
                <div className="absolute top-4 right-4 text-gray-500 cursor-pointer">
                <IoBriefcase />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 px-4">{position.title}</h3>
              </div>

              <div className="bg-white px-6 py-4 flex items-center justify-between"  >
                <div className="flex items-center gap-2">
                  <img src={position.company_logo} alt={position.company} className="h-6 w-6 object-contain" />
                  <span className="text-sm text-gray-700">{position.company}</span>
                </div>
                <button
                  className="bg-black text-white text-sm px-4 py-2 rounded-full font-semibold"
                  onClick={() => setSelectedJob(position)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4 " data-aos="fade-up" data-aos-delay='100'>
          <div className="bg-white max-w-xl w-full p-6 rounded-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" data-aos="fade-right" data-aos-delay='200'>{selectedJob.title}</h3>
            <p className="text-gray-600 mb-4" data-aos="fade-right" data-aos-delay='300'>{selectedJob.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              <p data-aos="fade-right" data-aos-delay='350'><strong>Department:</strong> {selectedJob.department}</p>
              <p data-aos="fade-right" data-aos-delay='400'><strong>Location:</strong> {selectedJob.location}</p>
              <p data-aos="fade-right" data-aos-delay='450'><strong>Type:</strong> {selectedJob.type}</p>
              <p data-aos="fade-right" data-aos-delay='500'><strong>Salary:</strong> {selectedJob.salary}</p>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2" data-aos="fade-right" data-aos-delay='550'>Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {selectedJob.requirements.map((req, i) => (
                <li key={i} data-aos="fade-right" data-aos-delay={`${550+i*100}`}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section> */}

      {/* Hiring Process */}

      <section className="py-20 bg-gray-50">
  <div className="max-w-5xl mx-auto px-4 relative">
    {/* Title */}
    <div className="text-center mb-16" data-aos="fade-up">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
      <p className="text-xl text-gray-600">A transparent journey from application to offer</p>
    </div>

    {/* Vertical Line */}
    <div className="absolute left-1/2 top-36 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0"></div>

    {/* Steps */}
    <div className="flex flex-col space-y-16 relative z-10">
      {hiringProcess.map((step, index) => (
        <div
          key={index}
          className={`relative flex items-center w-full ${
            index % 2 === 0 ? "justify-start pr-10" : "justify-end pl-10"
          }`}
          data-aos="fade-up"
          data-aos-delay={index * 200}
        >
          {/* Icon on the vertical line */}
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 
              w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-full text-2xl"
            style={{ top: "50%", transform: "translate(-50%, -50%)" }}
          >
            {step.icon}
          </div>

          {/* Step content */}
          <div className="w-1/2">
            <div className="bg-white shadow-md border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">{step.title}</h3>
              <p className="text-sm text-gray-600 text-center">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* benifits and perks */}
<section className="py-20">
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    <div className="text-center mb-16 animate-on-scroll">
      <h2
        className="text-4xl font-bold text-gray-900 mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Benefits & Perks
      </h2>
      <p
        className="text-xl text-gray-600"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        We believe in taking care of our team members and providing everything you need to do your best work.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
      {Perks.map((value, index) => (
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
            <p className="text-sm text-gray-600">{value.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>




      {/* Team Testimonials */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Team Says</h2>
            <p className="text-xl text-gray-600">Hear from the people who make IntelliSurge special</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-on-scroll">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl text-green-100 mb-8">
            Take the next step in your career journey with IntelliSurge Technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              View All Positions
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Submit Resume
            </button>
          </div>
        </div>
      </section> */}
      <Footer/>
    </div>
  );
};

export default Careers;
