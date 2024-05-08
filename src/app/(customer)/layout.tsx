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
    <div className="mb-20">
      <div className="sticky top-0 z-10">
        <MainNav />
      </div>
      {children}
    </div>
  );
};

export default Layout;
