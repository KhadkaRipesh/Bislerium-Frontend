"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import BloggersTable from "./_components/BloggersTable";

const Admins = () => {
  return (
    <div>
      <div className="flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl lg:text-3xl font-black text-gray-700">
          Bloggers
        </h1>
      </div>
      <div>
        <BloggersTable />
      </div>
    </div>
  );
};

export default Admins;
