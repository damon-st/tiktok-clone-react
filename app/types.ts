export type UserContextTypes = {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
};

export type Profile = User & {};
export type User = {
  id: string;
  name: string;
  bio: string;
  image: string;
  user_id?: string;
};

///LAYOUT INCLUDE TYPES

export type RandomUsers = {
  id: string;
  name: string;
  image: string;
};

export type CropperDimensions = {
  height?: number | null;
  width?: number | null;
  letf?: number | null;
  top?: number | null;
};

export type ShoErrorObjet = {
  type: string;
  message: string;
};

export type Like = {
  id: string;
  user_id: string;
  post_id: string;
};

export type Post = {
  id: string;
  user_id: string;
  video_url: string;
  text: string;
  created_at: string;
};

export type CommentWithProfile = {
  id: string;
  user_id: string;
  post_id: string;
  text: string;
  created_at: string;
  profile: {
    user_id: string;
    name: string;
    image: string;
  };
};

export type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  text: string;
  created_at: string;
};

export type PostWithProfile = {
  id: string;
  user_id: string;
  video_url: string;
  text: string;
  created_at: string;
  profile: {
    user_id: string;
    name: string;
    image: string;
  };
};

export type UploadError = {
  type: string;
  message: string;
};

//Componets Type

export type SingleCommentCompTypes = PostPageTypes & {
  comment: CommentWithProfile;
};

export type CommentsCompTypes = PostPageTypes & {};

export type CommentsHeaderCompTypes = PostPageTypes & PostMainCompTypes & {};

export type PostMainCompTypes = {
  post: PostWithProfile;
};

export type PostPageTypes = {
  params: { userId: string; postId: string };
};

export type PostMainLikesCompTypes = {
  post: PostWithProfile;
};

export type PostUserCompTypes = {
  post: Post;
};

export type ProfilePageTypes = {
  params: { id: string };
};

// LAYOUT INCLUDE TYPES

export type MenuItemsTypes = {
  iconString: string;
  colorString: string;
  sizeString: string;
};

export type MenuItemFollowCompTypes = {
  user: RandomUsers;
};

export type TextInputCompTypes = {
  string: string;
  inputType: string;
  placeHolder: string;
  onUpdate: (newValue: string) => void;
  error: string;
};
