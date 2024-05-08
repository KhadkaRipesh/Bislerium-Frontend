declare interface Comment {
  id: number;
  body: string;
  userID: number;
  blogID: number;
  createdAt: string;
  user: User;
  blog: Blog;
}
