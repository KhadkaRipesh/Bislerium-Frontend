"use client";
import React from "react";
import BlogTable from "./_components/BlogTable";

const BlogPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl lg:text-3xl font-black text-gray-700">Blogs</h1>
      </div>
      <div>
        <BlogTable />
      </div>
    </div>
  );
};

export default BlogPage;
