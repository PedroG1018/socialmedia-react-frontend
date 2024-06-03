import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User_T } from "../../utils/types/types";

const EditProfileModal = ({ authUser }: { authUser: User_T }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    links: [],
    newPassword: "",
    currentPassword: "",
  });

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Couldn't update your information");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        links: authUser.links,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);
  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit Profile
      </button>
    </>
  );
};

export default EditProfileModal;
