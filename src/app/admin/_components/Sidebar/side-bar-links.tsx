import { Icon } from "@iconify/react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  isAdmin?: boolean;
};

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/admin/home",
    icon: <Icon icon="lucide:home" width="18" height="18" />,
  },
  {
    title: "Blogs",
    path: "/admin/blogs",
    icon: <Icon icon="lucide:scroll-text" width="18" height="18" />,
  },
  {
    title: "Bloggers",
    path: "/admin/bloggers",
    icon: <Icon icon="lucide:user-round-check" width="18" height="18" />,
  },
  {
    title: "Admins",
    path: "/admin/admins",
    icon: <Icon icon="lucide:shield-check" width="18" height="18" />,
  },
];
