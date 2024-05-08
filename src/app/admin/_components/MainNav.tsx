"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { UserContext } from "@/useContext/UserProvider";
import { useCookies } from "next-client-cookies";
import { baseURL } from "@/core/constant/base_url";
import { User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import SideBar from "./Sidebar";

const MainNav = () => {
  const cookies = useCookies();

  const { user } = useContext(UserContext);
  const token = cookies.get("token");

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/User/logout`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
      if (res.status === 200) {
        cookies.remove("token");
        toast.success("Logged out successfully");
        setTimeout(() => {
          window.location.pathname = "/";
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-5 py-2">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger>
              <AlignJustify />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-neutral-800 text-white w-[350px]"
            >
              <SheetHeader>
                <SideBar />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="lg:ml-60">
          <h1 className="text-lg lg:text-xl font-black tracking-tight">
            Hi {user?.userName}
          </h1>
        </div>
        <div className="flex gap-7 items-center">
          {token ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={`${baseURL}/${user?.image}`} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="capitalize">
                    {user?.userName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/change-password" className="w-full">
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <p
                      className="w-full hover:cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/signin">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainNav;
