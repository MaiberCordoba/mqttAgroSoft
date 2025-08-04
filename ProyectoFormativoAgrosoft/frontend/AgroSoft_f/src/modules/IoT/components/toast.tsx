import {Alert} from "@heroui/react";
import React from "react";

interface ToastProps {
  isOpen: boolean;
  message: string;
  color?: "success" | "default";
  onClose: () => void;
}

export function Toast({isOpen, message, color = "success", onClose}: ToastProps) {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-auto max-w-[420px]">
      <Alert
        className="w-full"
        color={color}
        isClosable
        variant="solid"
        onClose={onClose}
      >
        {message}
      </Alert>
    </div>
  );
}