import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Post_T } from "../../utils/types/types";
import Post from "./Post";

type PostsProps = {
  feedType: string;
  username?: string;
  userId?: string;
};

const Posts = ({ feedType, username, userId }: PostsProps) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center"></div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts to be found</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post: Post_T) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
