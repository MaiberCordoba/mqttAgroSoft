// ✅ API - Obtener todos los controles
import { ControlDetails } from "../types";
import apiClient from "@/api/apiClient";

export const getAllControles = async (): Promise<ControlDetails[]> => {
  const { data } = await apiClient.get("/controles");
  return data;
};
