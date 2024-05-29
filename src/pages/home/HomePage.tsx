import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BiLogOut } from "react-icons/bi";

type AuthUser = {
  username: string;
  fullName: string;
  profilePic: string;
};

const HomePage = () => {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to logout");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery<AuthUser>({ queryKey: ["authUser"] });

  return (
    <div>
      <BiLogOut
        className="w-5 h-5 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          logout();
        }}
      ></BiLogOut>
    </div>
  );
};

export default HomePage;
