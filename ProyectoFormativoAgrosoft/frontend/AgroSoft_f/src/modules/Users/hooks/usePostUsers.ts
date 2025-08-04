import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { User } from "../types";
import { registerUser } from "../api/usersApi";

export const usePostUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, User>({
    mutationKey: ['crearUsuario'],
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("usuario creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['users'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nuevo usuario registrado con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear usuario:", error);
      addToast({
        title: 'Error al crear el usuario',
        description: 'No fue posible  registrar el usuario',
        color: 'success'
      })
    },
  });
};