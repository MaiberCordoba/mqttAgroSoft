import { ReactNode } from "react";
import CustomButton from "../ui/boton";

interface FormGlobalProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const FormGlobal = ({ children, title, className }: FormGlobalProps) => {
  return (
    <div className={`p-6 bg-white shadow-lg rounded-xl w-full max-w-lg mx-auto ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div>{children}</div>
      <div className="mt-4">
        <CustomButton>Enviar</CustomButton>
      </div>
    </div>
  );
};

export default FormGlobal;
