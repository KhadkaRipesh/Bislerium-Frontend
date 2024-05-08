import Link from "next/link";
import { SIDENAV_ITEMS, SideNavItem } from "./side-bar-links";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
type UserType = {
  role: string;
};
const SideBar = () => {
  return (
    <div className=" bg-neutral-800 h-full">
      <Link
        href="/admin/home"
        className="flex flex-row items-center justify-center lg:justify-start px-6 border-b border-zinc-200 h-16 w-full"
      >
        <span className="font-bold text-xl flex text-white">Bislerium</span>
      </Link>

      <div className="flex flex-col h-full space-y-2 py-6 px-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg inset-y-0 z-50">
        {SIDENAV_ITEMS.map((item, idx) => {
          return (
            <div key={idx}>
              <MenuItem item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();

  return (
    <div>
      <Link
        href={item.path}
        className={`flex flex-row space-x-4 items-center p-2 min-w-[200px] text-black rounded-xl ${
          pathname === item.path
            ? "bg-white hover:bg-gray-700"
            : "hover:bg-gray-700"
        }`}
      >
        <div
          className={`${
            pathname === item.path ? "font-bold text-black" : "text-white"
          }`}
        >
          {item.icon}
        </div>
        <span
          className={`${
            pathname === item.path ? "font-bold text-black" : "text-white"
          } flex`}
        >
          {item.title}
        </span>
      </Link>
    </div>
  );
};
