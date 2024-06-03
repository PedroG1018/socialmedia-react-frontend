import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import toast from "react-hot-toast";
import { Post_T, User_T } from "../../utils/types/types";
import { Link, useNavigate } from "react-router-dom";
import { FaRegHeart, FaTrash } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const Post = ({ post }) => {
  const { data: authUser } = useQuery<User_T>({ queryKey: ["authUser"] });

  const postOwner = post.user;

  const isLiked: boolean = post.likes.includes(authUser!._id);

  const isMyPost: boolean = authUser!._id === post.user._id;

  const formattedDate: string = moment(post.createdAt).fromNow();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Couldn't delte post");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Couldn't like post");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData: Post_T[]) => {
        return oldData.map((oldPost) => {
          if (oldPost._id === post._id) {
            return { ...oldPost, likes: updatedLikes };
          }

          return oldPost;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <>
      <div
        className="flex gap-2 items-start p-4 border-b border-gray-700 cursor-pointer"
        onClick={() => navigate(`/post/${post._id}`)}
      >
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img
              src={postOwner.profilePic || "/avatar-placeholder.png"}
              alt=""
            />
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
              <span>·</span>
              <span>{formattedDate}</span>
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
                alt={post.text}
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
                )}
                <span
                  className={`text-sm group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
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

export default Post;
