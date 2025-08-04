import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "../../api/sensor";
import { SensorData } from "../../types/sensorTypes";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

export const usePostSensor = () => {
  const queryClient = useQueryClient();

  return useMutation<SensorData, AxiosError<{ message?: string }>, SensorData>({
    mutationKey: ["crearSensor"],
    mutationFn: post,
    onSuccess: (data) => {
      console.log("Sensor creado con éxito:", data);
      
      queryClient.invalidateQueries({ 
        queryKey: ["sensor"],
        refetchType: "active" 
      });

    },
    onError: (error) => {
      console.error("Error detallado:", error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || "No fue posible registrar el nuevo sensor";

      addToast({
        title: "Error al crear el sensor",
        description: errorMessage,
        color: "danger",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sensor"] });
    }
  });
};