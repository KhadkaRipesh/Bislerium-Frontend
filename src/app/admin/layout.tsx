"use client";
import React from "react";
import MainNav from "./_components/MainNav";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/core/constant/base_url";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserContext } from "@/useContext/UserProvider";
import { useCookies } from "next-client-cookies";
import SideBar from "./_components/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const cookies = useCookies();

  const { user, updateUser } = useContext(UserContext);
  const token = cookies.get("token");
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/User/get-current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCurrentUser(response.data);
      } catch (error) {
        router.push("/");
      }
    };

    fetchData();
  }, [token, router]);

  useEffect(() => {
    updateUser(currentUser);
  }, [currentUser, updateUser]);
  return (
    <div className="h-full">
      <div className="h-full flex-col fixed inset-y-0 z-50 hidden lg:block">
        <SideBar />
      </div>
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <div className="flex-grow lg:ml-60 px-5 mt-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
