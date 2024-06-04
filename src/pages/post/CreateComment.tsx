import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User_T } from "../../utils/types/types";

const CreateComment = ({ postId }: { postId: string | undefined }) => {
  const [text, setText] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<User_T>({ queryKey: ["authUser"] });

  const { mutate: createComment, isPending: isCommentPending } = useMutation({
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
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["comments"] }),
      ]);
      setText("");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createComment();
  };

  return (
    <div className="flex gap-2 items-start p-4">
      <div className="avatar">
        <Link
          to={`/profile/${authUser!.username}`}
          className="w-12 rounded-full overflow-hidden"
        >
          <img src={authUser!.profilePic || "/avatar-placeholder.png"} />
        </Link>
      </div>
      <form className="flex w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea bg-transparent w-full p-0 text-lg border-none resize-none focus:outline-none border-gray-800"
          placeholder="Post your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary rounded-full btn-sm text-white px-4">
          {isCommentPending ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
