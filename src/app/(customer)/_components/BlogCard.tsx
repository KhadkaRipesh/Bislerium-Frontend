import { baseURL } from "@/core/constant/base_url";
import { Dot } from "lucide-react";
import Link from "next/link";
import React from "react";

const BlogCard = ({ blog }: { blog: Blog }) => {
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
  return (
    <div className="w-full">
      <div>
        <Link href={`blog/${blog.slug}`}>
          <img src={`${baseURL}/${blog.image}`} alt="" className="h-60 object-cover rounded-2xl" />
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

export default BlogCard;
