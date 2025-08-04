import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSensor } from "../../api/sensor";
import { SensorData } from "../../types/sensorTypes";
import { addToast } from "@heroui/toast";

export const useDeleteSensor = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { id: number }, { previousSensores?: SensorData[] }>({
        mutationFn: ({ id }) => deleteSensor(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['sensor'] });
            const previousSensores = queryClient.getQueryData<SensorData[]>(['sensor']);
            queryClient.setQueryData<SensorData[]>(['sensor'], (old) => 
                old?.filter(sensor => sensor.id !== variables.id) || []
            );
            return { previousSensores };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el sensor",
                color: "danger",
            });
            
            if (context?.previousSensores) {
                console.error(error)
                queryClient.setQueryData(['sensor'], context.previousSensores);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sensor'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El sensor fue eliminado correctamente",
                color: "success",
            });
        }
    });
};