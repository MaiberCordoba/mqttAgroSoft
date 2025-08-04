import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { User } from "../types";
import { deleteUser } from "../api/usersApi";

export const useDeleteUsers= () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, { id: number }, { previoususers?: User[] }>({
        mutationFn: ({ id }) => deleteUser(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previoususers = queryClient.getQueryData<User[]>(['users']);
            queryClient.setQueryData<User[]>(['users'], (old) => 
                old?.filter(users => users.id !== variables.id) || []
            );
            return { previoususers };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el usuario",
                color: "danger",
            });
            
            if (context?.previoususers) {
                console.error(error)
                queryClient.setQueryData(['users'], context.previoususers);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            
            addToast({
                title: "Operación exitosa",
                description: "Usuario eliminado correctamente",
                color: "success",
            });
        }
    });
};