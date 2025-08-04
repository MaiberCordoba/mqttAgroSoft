import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const Principal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar fijo */}
      <div className="fixed top-0 w-full z-50 shadow-lg h-16 bg-sena-green">
        <Navbar
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleSidebar={() => setIsSidebarOpen(true)}
        />
      </div>

      {/* Sidebar desktop */}
      <div
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300
          ${isSidebarOpen ? "w-48" : "w-20"}
          hidden md:block group/sidebar
        `}
        onMouseEnter={() => setIsHoveringSidebar(true)}
        onMouseLeave={() => setIsHoveringSidebar(false)}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          isHovering={isHoveringSidebar}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Sidebar móvil con overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity
        ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar móvil */}
      <div
        className={`
          md:hidden fixed h-full z-50 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
        `}
      >
        <Sidebar isOpen={true} />
      </div>

      {/* Contenido Principal */}
      <div
        className={`
          flex flex-col flex-1 mt-16
          transition-all duration-300
          ${isSidebarOpen ? "md:ml-48" : "md:ml-20"}
          min-w-0
        bg-[#f2f8f9]
        `}
      >
        <main className="flex-1 pb-16 relative">
          <div className="relative z-10 min-h-screen">
            <div className="max-w-full overflow-x-hidden">
              <Outlet />
            </div>
          </div>

          <div ref={sentinelRef} className="h-px w-full relative z-10" />
        </main>
      </div>

      {/* Footer */}
      <div
        className={`
          fixed bottom-0 transition-transform duration-300
          ${isFooterVisible ? "translate-y-0" : "translate-y-full"}
          ${isSidebarOpen ? "md:left-48" : "md:left-20"}
          right-0 left-0 md:left-20
          z-20
        `}
      >
        <Footer isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default Principal;
