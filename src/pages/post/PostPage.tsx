import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ParentPost from "./ParentPost";
import Comments from "./Comments";

const PostPage = () => {
  const { id: postId } = useParams();

  const {
    data: post,
    refetch,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/post/${postId}`);

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Couldn't get post");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="p-2">
      <div>
        <p className="font-bold text-2xl">Post</p>
      </div>
      {!isLoading && !isRefetching && post && <ParentPost post={post} />}
      <Comments />
    </div>
  );
};

export default PostPage;
