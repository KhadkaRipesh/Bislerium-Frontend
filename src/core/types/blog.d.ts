declare interface Blog {
  id: number;
  title: string;
  summary: string;
  body: string;
  slug: string;
  image: string;
  createdAt: string;
  userID: number;
  user: User;
}
