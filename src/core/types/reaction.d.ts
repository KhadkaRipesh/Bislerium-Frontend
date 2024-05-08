declare interface Reaction {
  id: number;
  userID: number;
  blogID: number;
  commentID: number;
  type: number;
  typeName: string;
  user: User;
  blog: Blog;
  comment: Comment;
}
