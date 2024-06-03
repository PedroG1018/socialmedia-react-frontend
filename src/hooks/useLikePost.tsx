import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Post_T } from "../utils/types/types";

const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${postId}`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData: Post_T[]) => {
        return oldData.map((oldPost) => {
          if (oldPost._id === postId) {
            return { ...oldPost, likes: updatedLikes };
          }
          return oldPost;
        });
      });

      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { likePost, isLiking };
};

export default useLikePost;
