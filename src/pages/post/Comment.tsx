import { Link, useNavigate } from "react-router-dom";
import { Comment_T, User_T } from "../../utils/types/types";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaRegHeart, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Comment = ({ comment }) => {
  const { data: authUser } = useQuery<User_T>({ queryKey: ["authUser"] });

  const commentOwner: User_T = comment.user;

  const isLiked: boolean = comment.likes.includes(authUser!._id);

  const isMyComment: boolean = authUser!._id === comment.user._id;

  const formattedDate: string = moment(comment.createdAt).fromNow();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: likeComment, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/comments/like/${comment._id}`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not like comment");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["comments"], (oldData: Comment_T[]) => {
        return oldData.map((oldComment) => {
          if (oldComment._id === comment._id) {
            return { ...oldComment, likes: updatedLikes };
          }

          return oldComment;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLikeComment = () => {
    likeComment();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${commentOwner.username}`}
            className="w-10 rounded-full overflow-hidden"
          >
            <img src={commentOwner.profilePic || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link
              to={`/profile/${commentOwner.username}`}
              className="font-bold"
            >
              {commentOwner.username}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${commentOwner.username}`}>
                @{commentOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyComment && (
              <span className="flex justify-end flex-1">
                <FaTrash className="cursor-pointer hover:text-red-500" />
              </span>
            )}
          </div>

          <div className="flex flex-col overflow-hidden cursor-pointer gap-3">
            <span>{comment.text}</span>
          </div>

          <div className="flex justify-between mt-3">
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikeComment}
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
                {comment.likes.length}
              </span>
            </div>
          </div>
        </div>
      </div>
      {comment.childComments.map((childComment) => (
        <Comment comment={childComment} />
      ))}
    </>
  );
};

export default Comment;
