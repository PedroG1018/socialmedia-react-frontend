import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Couldn't follow user");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;
