import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { User_T } from "../../utils/types/types";
import moment from "moment";
import useDeletePost from "../../hooks/useDeletePost";
import useLikePost from "../../hooks/useLikePost";
import { FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ParentPost = ({ post, numComments }) => {
  const { data: authUser } = useQuery<User_T>({ queryKey: ["authUser"] });

  const postOwner: User_T = post.user;

  const isLiked: boolean = post.likes.includes(authUser!._id);

  const isMyPost: boolean = authUser!._id === post.user._id;

  const formattedDate: string = moment(post.createdAt).fromNow();

  const { deletePost, isDeleting } = useDeletePost(post._id);

  const { likePost, isLiking } = useLikePost(post._id);

  const handleDeletePost = () => {
    deletePost();
  };

  const handleLikePost = () => {
    likePost();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-10 rounded-full overflow-hidden"
          >
            <img src={postOwner.profilePic || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-500 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}

                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
              />
            )}
          </div>

          <div className="flex text-gray-500 py-4 border-b border-gray-700">
            <span>{formattedDate}</span>
          </div>

          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-1/3 justify-between mx-auto">
              <div className="flex gap-1 items-center cursor-pointer group">
                <FaRegComment className="w-4 h-4 text-gray-500 group-hover:text-sky-400" />
                <span className="text-sm text-gray-500 grou-hover:text-sky-400">
                  {numComments}
                </span>
              </div>

              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="h-4 w-4 cursor-pointer text-gray-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
                )}
                <span
                  className={`text-sm group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-gray-500"
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParentPost;
