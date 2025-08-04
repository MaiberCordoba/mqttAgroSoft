import React from "react";

export function Card({ children, className }: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}