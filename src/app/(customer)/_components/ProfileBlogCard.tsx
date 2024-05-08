import { baseURL } from "@/core/constant/base_url";
import { CircleEllipsis, Dot, EclipseIcon, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import EditBlog from "../blog/_component/EditBlog";
import DeleteBlog from "../blog/_component/DeleteBlog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Blog = ({ blog }: { blog: Blog }) => {
  const formattedDate = blog?.createdAt
    ? new Date(blog?.createdAt).toLocaleString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const currentDate = new Date(blog?.createdAt).toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  console.log(blog);

  return (
    <div className="w-full">
      <div>
        <Link href={`blog/${blog.slug}`}>
          <Avatar className="w-full h-[200px] rounded-2xl">
            <AvatarImage
              src={`${baseURL}/${blog?.image}`}
              className="object-cover"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div>
          {formattedDate === currentDate ? (
            <span className="text-sm flex gap-1 items-center">
              <p>Today</p>
              <div>
                <Dot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[#ff1111] text-sm tracking-wide">
                  new
                </span>
              </div>
            </span>
          ) : (
            <span className="text-sm">{formattedDate}</span>
          )}
        </div>
        <div className="flex gap-2">
          <EditBlog blog={blog} />
          <DeleteBlog blog={blog} />
        </div>
      </div>
      <Link href={`blog/${blog.slug}`}>
        <div className="mt-2">
          <h1 className="font-bold text-xl mt-3">
            {blog.title.slice(0, 100)}
            {blog.title.length > 100 && "..."}
          </h1>
          <p className="text-black/[0.8]">
            {blog.summary.slice(0, 100)}
            {blog.title.length > 100 && "..."}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Blog;
