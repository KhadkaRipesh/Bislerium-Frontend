"use client";

import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { baseURL } from "@/core/constant/base_url";
import { UserContext } from "@/useContext/UserProvider";
import { Button } from "@/components/ui/button";
import EditProfile from "./_components/EditProfile";
import DeleteProfile from "./_components/DeleteProfile";
import Link from "next/link";
import { BadgePlus, User } from "lucide-react";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import Blog from "../_components/ProfileBlogCard";
import AddBlog from "../blog/_component/AddBlog";

const ProfilePage = () => {
  const cookie = useCookies();
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/blog/get-my-blogs/`, {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, [cookie]);

  return (
    <div className="container mt-10">
      <div className="flex flex-col-reverse lg:flex lg:flex-row justify-between items-center">
        <div className="flex items-center gap-10">
          <div>
            <Avatar className="w-32 h-32">
              <AvatarImage src={`${baseURL}/${user?.image}`} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div>
              <h1 className="font-bold text-3xl capitalize">
                {user?.userName}
              </h1>

              <p className="mt-2">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between gap-10">
              <p>
                <span className="text-lg font-bold">{data.length}</span> posts
              </p>
              <p>
                <span className="text-lg font-bold">0</span> likes
              </p>
              <p>
                <span className="text-lg font-bold">0</span> dislikes
              </p>
              <p>
                <span className="text-lg font-bold">0</span> comments
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <EditProfile />
          <DeleteProfile />
        </div>
      </div>
      <div className="flex flex-col justify-center text-center mt-14 gap-2">
        <h1>Share your experience to world</h1>
        <AddBlog />
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-5">
          {data.map((blog, index) => (
            <div key={index} className="flex gap-5">
              <Blog blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
