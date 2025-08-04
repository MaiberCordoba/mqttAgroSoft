import { useEffect, useRef } from "react";
import { addToast } from "@heroui/react";

type CustomToastProps = {
  title?: string;
  description?: string;
  variant?: "flat" | "bordered" | "solid";
  timeout?: number;
  color?: "primary" | "default" | "foreground" | "secondary" | "success" | "warning" | "danger";
};

const Toast = ({
  title,
  description,
  variant = "flat",
  timeout = 5000,
  color = "danger"
}: CustomToastProps) => {
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current) {
      addToast({ title, description, variant, timeout, color });
      toastShown.current = true;
    }
  }, []);

  return null;
};

export default Toast;
