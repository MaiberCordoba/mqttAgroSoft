import { useQuery } from "@tanstack/react-query";
import { get } from "../../api/sensor";
import { SensorData } from "../../types/sensorTypes";
export const useGetSensor = () => {
  return useQuery<SensorData[], Error>({
    queryKey: ["sensor"], 
    queryFn: get, 
  });
};

