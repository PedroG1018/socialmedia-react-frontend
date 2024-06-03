import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { User_T } from "../../utils/types/types";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const { data: authUser } = useQuery<User_T>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({ text, img }: { text: string; img: string }) => {
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to create post");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: async () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profilePic || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea bg-transparent w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
