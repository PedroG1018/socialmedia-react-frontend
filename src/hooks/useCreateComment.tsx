import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateComment = (postId: string, text: string, setText) => {
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/comments/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not create comment");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post"] }),
        queryClient.invalidateQueries({ queryKey: ["comments"] }),
      ]);
      setText("");
    },
  });

  return { createComment, isCommenting };
};

export default useCreateComment;
