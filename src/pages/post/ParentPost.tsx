import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { User_T } from "../../utils/types/types";
import moment from "moment";

const ParentPost = ({ post }) => {
  const { data: authUser } = useQuery<User_T>({ queryKey: ["authUser"] });

  const postOwner: User_T = post.user;

  const isLiked: boolean = post.likes.includes(authUser!._id);

  const isMyPost: boolean = authUser!._id === post.user._id;

  const formattedDate: string = moment(post.createdAt).fromNow();

  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profilePic || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
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
        </div>
      </div>
    </>
  );
};

export default ParentPost;
