export type User = {
  id: string;
  fullName: string;
  username: string;
  password: string;
  email: string;
  followers: User[];
  following: User[];
  profilePic: string;
  coverPic: string;
  bio: string;
  links: string[];
  likedPosts: Post[];
  likedComment: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

export type Post = {
  id: string;
  user: User | string;
  text: string;
  likes: User[] | string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  id: string;
  user: User | string;
  text: string;
  parentPostId: Post | string;
  parentCommentId?: Comment | string;
  childComments: Comment[];
  likes: User[] | string[];
  createdAt: Date;
  updatedAt: Date;
};
