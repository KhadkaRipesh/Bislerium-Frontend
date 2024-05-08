"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import { Dot, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from "@/useContext/UserProvider";
import LikeBlog from "../_component/LikeBlog";
import DislikeBlog from "../_component/DislikeBlog";
import Comments from "../_component/Comments";
import toast from "react-hot-toast";

const BlogSinglePage = ({ params }: { params: { slug: string } }) => {
  const { user } = useContext(UserContext);
  const cookie = useCookies();
  const slug = params.slug;
  const [blog, setBlog] = useState<Blog>();
  const [comment, setComment] = useState<string>("");

  const formattedDate = blog?.createdAt
    ? new Date(blog?.createdAt).toLocaleString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/Blog/${slug}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        });
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, [cookie, slug]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!user || Object.keys(user).length === 0) {
      toast.error("You need to login to like this blog");
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/api/Comment`,
        {
          Body: comment,
          BlogID: blog?.id,
          Type: "like",
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(blog);

  return (
    <div className="container mt-16">
      <div></div>
      <div>
        <h1 className="text-3xl font-black">{blog?.title}</h1>

        <div className="flex items-center mt-5">
          <Avatar>
            <AvatarImage src={`${baseURL}/${blog?.user?.image}`} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p className="ml-3">{blog?.user?.userName}</p>
          <Dot />
          <p>{formattedDate}</p>
        </div>
      </div>
      <div>
        <p className="mt-10">{blog?.summary}</p>
      </div>
      <div className="mt-5">
        <img src={`${baseURL}/${blog?.image}`} alt="" className="w-[200px] h-[200px] object-cover rounded-2xl" />
      </div>
      <div className="mt-5">
        <div dangerouslySetInnerHTML={{ __html: blog?.body ?? "" }} />
      </div>
      <Separator className="my-5" />
      <div>
        <div className="flex gap-3">
          <div className="flex-1">
            <LikeBlog blog={blog} />
          </div>
          <div className="flex-1">
            <DislikeBlog blog={blog} />
          </div>
        </div>
        <div className="grid w-full gap-2 mt-3">
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <Textarea
              placeholder="Type your message here."
              onChange={(e) => setComment(e.target.value)}
            />
            <Button>Post Comment</Button>
          </form>
        </div>
        <Separator className="my-5" />
        <Comments blog={blog} />
      </div>
    </div>
  );
};

export default BlogSinglePage;
