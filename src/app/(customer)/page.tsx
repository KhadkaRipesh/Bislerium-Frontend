"use client";

import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import { useEffect, useState } from "react";
import BlogCard from "./_components/BlogCard";

export default function CustomerHomePage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/Blog`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="container mt-5">
      <h1 className="font-semibold">Recent Blog Post</h1>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-5">
          {data.map((blog, index) => (
            <div key={index} className="flex gap-5">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
