import React from "react";

interface FooterProps {
  isSidebarOpen: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isSidebarOpen }) => {
  return (
    <footer className="bg-sena-green border-t border-gray-200 p-4 w-full text-white">
      {" "}
      {/* Cambiamos bg-white a bg-sena-green y añadimos text-white */}
      <div
        className={`mx-auto flex justify-between items-center ${isSidebarOpen ? "max-w-[calc(100%-14rem)]" : "max-w-full"}`}
      >
        <p className="text-sm">© {new Date().getFullYear()} Agrosoft - SENA</p>
      </div>
    </footer>
  );
};
