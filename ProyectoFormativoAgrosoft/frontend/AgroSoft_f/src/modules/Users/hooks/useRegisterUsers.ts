import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/modules/Users/api/usersApi";
import { User } from "../types";

export const useRegisterUser = () => {
  return useMutation<User, Error, Partial<User>>({
    mutationFn: registerUser,
  });
};