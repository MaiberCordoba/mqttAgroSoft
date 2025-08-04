import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { getUsers } from "../api/usersApi";


export const useGetUsers = () => {
  const query = useQuery<User[], Error>({
    queryKey: ["users"], 
    queryFn: getUsers, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};

