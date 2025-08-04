import { Button, ButtonProps } from "@heroui/react";

interface ButtonGlobalProps extends ButtonProps {
  children: React.ReactNode;
}

const ButtonGlobal = ({ children, color = "success", variant="solid", ...props }: ButtonGlobalProps) => {
  return (
    <Button color={color} variant={variant} {...props}>
      {children}
    </Button>
  );
};

export default ButtonGlobal;
