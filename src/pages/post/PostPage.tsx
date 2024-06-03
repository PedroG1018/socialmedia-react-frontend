import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ParentPost from "./ParentPost";
import Comments from "./Comments";
import { FaArrowLeft } from "react-icons/fa";

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

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/comments/${postId}`);

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Couldn't get post's comments");

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
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen p-2">
      <div className="flex gap-10 px-4 py-2 items-center">
        <Link to="/">
          <FaArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col">
          <p className="font-bold text-lg">Post</p>
        </div>
      </div>
      {!isLoading && !isRefetching && post && (
        <div>
          <ParentPost post={post} numComments={comments?.length} />

          <Comments />
        </div>
      )}
    </div>
  );
};

export default PostPage;
