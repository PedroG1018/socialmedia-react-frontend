export type User_T = {
  _id: string;
  fullName: string;
  username: string;
  password: string;
  email: string;
  followers: User_T[];
  following: User_T[];
  profilePic: string;
  coverPic: string;
  bio: string;
  link: string;
  likedPosts: Post_T[];
  likedComment: Comment_T[];
  createdAt: Date;
  updatedAt: Date;
};

export type Post_T = {
  _id: string;
  user: User_T | string;
  text: string;
  likes: User_T[] | string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Comment_T = {
  _id: string;
  user: User_T | string;
  text: string;
  parentPostId: Post_T | string;
  parentCommentId?: Comment_T | string;
  childComments: Comment_T[];
  likes: User_T[] | string[];
  createdAt: Date;
  updatedAt: Date;
};
