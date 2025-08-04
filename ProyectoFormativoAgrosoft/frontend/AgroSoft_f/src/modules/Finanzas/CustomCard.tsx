import { Button, Card, CardBody, CardFooter } from "@heroui/react";

interface CustomCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: JSX.Element;
  data?: Record<string, string | number>;
  footerButtons?: {
    label: string;
    color?: "default" | "primary" | "secondary" | "success" | "danger" | "warning" | "solid";
    size?: "sm" | "md" | "lg";
    onPress: () => void;
  }[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  hoverEffect?: boolean;
  isPressable?: boolean;
  onPress?: () => void;
}

export default function CustomCard({
  title,
  subtitle,
  description,
  image,
  icon,
  data = {},
  footerButtons = [],
  backgroundColor = "white",
  borderColor = "gray-200",
  textColor = "gray-800",
  hoverEffect = true,
  isPressable = false,
  onPress,
}: CustomCardProps) {
  return (
    <Card
      isPressable={isPressable}
      onPress={onPress}
      className={`
        w-[280px] min-w-[280px] h-auto 
        flex flex-col justify-between
        rounded-2xl shadow-md ${hoverEffect ? "hover:shadow-xl transition" : ""}
        bg-${backgroundColor} border border-${borderColor} p-4
      `}
      style={{borderRadius:"1.5rem"}}
    >
      <CardBody className="flex flex-col items-start text-left justify-center w-full gap-2">
        {icon && <div className={`text-5xl text-${textColor}`}>{icon}</div>}
        {image && (
          <img
            src={image}
            alt={title}
            className="w-20 h-20 object-cover rounded mx-auto self center"
          />
        )}
        {title && <h3 className={`font-bold text-lg text-${textColor} text-center`}>{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 text-center">{subtitle}</p>}
        {description && <p className="text-sm text-center text-gray-600">{description}</p>}

        {Object.entries(data).map(([label, value]) => (
          <p key={label} className="text-sm text-center">
            <strong>{label}</strong>: {value}
          </p>
        ))}
      </CardBody>

      {footerButtons.length > 0 && (
        <>
          <div className="w-full border-t border-gray-200 my-2" />
          <CardFooter className="w-full flex flex-wrap gap-2 justify-center">
            {footerButtons.map((btn, i) => (
                <Button
                key={i}
                onPress={btn.onPress}
                className={`
                  px-3 py-1 rounded text-sm
                  bg-${btn.color ?? "primary"}/20 
                  text-${btn.color ?? "primary"} 
                  border border-${btn.color ?? "primary"}/30
                  hover:bg-${btn.color ?? "primary"}/30 
                  transition-colors duration-200
                  ${btn.size === "sm" ? "text-xs" : btn.size === "lg" ? "text-base" : ""}
                `}
                size="sm"
                >
                    {btn.label}
                </Button>
            ))}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
