declare interface Notification {
  id: number;
  body: string;
  createdAt: string;
  isActive: boolean;
  isDeleted: boolean;
  user: User;
  userID: number;
}
