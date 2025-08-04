import { Card, CardBody, CardFooter } from "@heroui/react";

interface SensorCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  subtitle?: string;
  alert?: boolean;
  onClick: () => void;
}

export default function SensorCard({ 
  icon, 
  title, 
  value, 
  subtitle,
  alert,
  onClick 
}: SensorCardProps) {
  return (
    <Card
      isPressable
      onPress={onClick}
      className={`
      w-[280px] min-w-[280px] h-[220px]
      flex flex-col items-center justify-between
      rounded-2xl shadow-lg hover:shadow-xl
      transition bg-white p-4 mx-1 my-2
      ${alert ? "border-2 border-red-500" : ""}
      `}
      style={{ borderRadius: "1.5rem" }} // Asegura bordes redondeados
    >
      <CardBody className="flex flex-col items-center justify-center w-full pb-3">
        <div className="text-gray-700 text-5xl mb-2">{icon}</div>
        <p className="text-xl font-bold text-center text-gray-800">
          {value}
        </p>
      </CardBody>

      <div className="w-full border-t border-gray-200" />

      <CardFooter className="w-full rounded-b-2xl p-3 bg-transparent">
        <div className="w-full text-center">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}