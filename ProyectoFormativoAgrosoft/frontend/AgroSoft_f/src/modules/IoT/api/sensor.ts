import apiClient from "@/api/apiClient";
import { SensorData } from "../types/sensorTypes";

export const get = async (): Promise<SensorData[]> => {
    const response = await apiClient.get("/sensor/");
    return response.data;
    
};

export const post = async (data: SensorData): Promise<SensorData> => {
    const response = await apiClient.post<SensorData>("/sensor/", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const patch = async (id: number, data: Partial<SensorData>): Promise<SensorData> => {
    const response = await apiClient.patch<SensorData>(`/sensor/${id}/`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteSensor = async (id: number): Promise<void> => {
    await apiClient.delete(`/sensor/${id}/`);
};