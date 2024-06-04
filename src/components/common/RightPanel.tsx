import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User_T } from "../../utils/types/types";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["searchResults"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/all/${search}`);

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not perform search");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, search]);

  return (
    <div className="hidden lg:block my-2 mx-2">
      {/* SEARCH */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search users"
          className="input rounded-full py-2 px-4 border border-gray-700"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div
          hidden={!search}
          className="bg-black border border-slate-900 rounded-xl"
        >
          {searchResults?.map((user: User_T) => (
            <>
              {isRefetching && <LoadingSpinner size="md" />}
              <div
                className="p-2 items-center flex gap-2 cursor-pointer"
                onClick={() => {
                  setSearch("");
                  navigate(`/profile/${user.username}`);
                }}
              >
                <div className="avatar">
                  <div className="w-8 rounded-full overflow-hidden">
                    <img src={user.profilePic || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.fullName}</span>
                    <span className="text-sm text-gray-700">
                      @{user.username}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
