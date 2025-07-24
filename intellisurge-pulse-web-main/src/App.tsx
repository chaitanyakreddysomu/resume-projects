
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
// import Testimonal from "./components/testimonals";
import { Helmet } from "react-helmet";

AOS.init();
const queryClient = new QueryClient();

const getPageTitle = (pathname: string) => {
  const routeMap: Record<string, string> = {
    "/": "Home",
    "/services": "Services",
    "/careers": "Careers",
    "/admin": "Admin",
  };
  return routeMap[pathname] || "Not Found";
};
const App = () => (
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []),
  <QueryClientProvider client={queryClient}>
    <Helmet>
        <link rel="icon" type="image/png" href="/LogoTM.png" />
        <title>Intellisurge Technologies</title>
        
      </Helmet>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />

          {/* <Route path="/testimonals" element={<Testimonal />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
