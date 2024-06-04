import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ParentPost from "./ParentPost";
import { FaArrowLeft } from "react-icons/fa";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import { Comment_T } from "../../utils/types/types";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const PostPage = () => {
  const { id: postId } = useParams();

  const {
    data: post,
    refetch: refetchPost,
    isRefetching: isPostRefetching,
    isLoading: isPostLoading,
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

  const {
    data: comments,
    refetch: refetchComments,
    isRefetching: isCommentsRefetching,
    isLoading: isCommentsLoading,
  } = useQuery({
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
    refetchPost();
    refetchComments;
  }, [refetchPost, refetchComments]);

  console.log(comments);

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
      {(isPostRefetching || isPostLoading) && <PostSkeleton />}
      {!isPostRefetching && !isPostLoading && post && (
        <div>
          <ParentPost post={post} numComments={comments?.length} />
          <CreateComment postId={postId} />
        </div>
      )}

      {(isCommentsLoading || isCommentsRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isCommentsLoading &&
        !isCommentsRefetching &&
        comments &&
        comments.map((comment: Comment_T) => <Comment comment={comment} />)}
    </div>
  );
};

export default PostPage;
