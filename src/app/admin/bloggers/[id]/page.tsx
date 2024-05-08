"use client";

import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import { UserContext } from "@/useContext/UserProvider";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import BloggersBlogTable from "./_components/BloggersBlogTable";

const BloggerPage = ({ params }: { params: { id: number } }) => {
  const { user } = useContext(UserContext);
  const cookie = useCookies();
  const id = params.id;
  const [blog, setBlog] = useState<Blog>();
  const [comment, setComment] = useState<string>("");
  const [blogger, setBlogger] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/User/get/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        });
        setBlogger(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [cookie, id]);

  const formattedDate = blog?.createdAt
    ? new Date(blog?.createdAt).toLocaleString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get(`${baseURL}/api/Blog/${slug}`, {
  //           headers: {
  //             Authorization: `Bearer ${cookie.get("token")}`,
  //           },
  //         });
  //         setBlog(response.data);
  //       } catch (error) {
  //         console.error("Error fetching blog data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [cookie, slug]);

  return (
    <div>
      <div className="flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-5">
          <div>
            <Avatar className="w-20 h-20">
              <AvatarImage src={`${baseURL}/${blogger?.image}`} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-xl lg:text-3xl font-black text-gray-700 capitalize">
            {blogger?.userName}
          </h1>
        </div>
        <div className="flex justify-between items-center gap-5">
          <Link href="/admin/bloggers">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>
      <div>
        <BloggersBlogTable userID={id} />
      </div>
    </div>
  );
};

export default BloggerPage;
