import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from "@heroui/react";
import { User } from '../types';
import { updateUser } from '../api/usersApi';

export const usePatchUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: number; data: Partial<User> }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (updatedUsers, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<User[]>(['users'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((users) =>
          users.id === variables.id ? { ...users, ...updatedUsers } : users
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El usuario se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el usuario",
        color: "danger",
       
      });
    }
  });
};