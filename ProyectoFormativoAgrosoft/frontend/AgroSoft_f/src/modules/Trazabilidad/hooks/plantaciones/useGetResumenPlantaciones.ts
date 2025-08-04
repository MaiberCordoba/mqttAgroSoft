// hooks/plantaciones/useGetResumenPlantaciones.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetResumenPlantaciones = () => {
  return useQuery({
    queryKey: ['resumen-plantaciones'],
    queryFn: async () => {
      const { data } = await axios.get('/api/plantaciones/resumen/');
      return data;
    }
  });
};
