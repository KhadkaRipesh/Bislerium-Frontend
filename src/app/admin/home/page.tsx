"use client";

import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "next-client-cookies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCM2AhEN5cwUqqjZeprEz39wpq5JsDnf-Y",
  authDomain: "bislerium-245d4.firebaseapp.com",
  projectId: "bislerium-245d4",
  storageBucket: "bislerium-245d4.appspot.com",
  messagingSenderId: "372157345596",
  appId: "1:372157345596:web:a2710d6c26823780093839",
  measurementId: "G-GT3DSKS03B",
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const HomePage = () => {
  const cookies = useCookies();

  const [stats, setStats] = React.useState<Stats>({} as Stats);
  const [month, setMonth] = React.useState(0);

  useEffect(() => {
    setToken();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/User/get-stats/${month}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats data:", error);
      }
    };

    fetchData();
  }, [cookies, month]);

  console.log(stats);

  async function setToken() {
    try {
      // Request the push notification permission from browser
      const status = await Notification.requestPermission();
      if (status && status === "granted") {
        // Get new token from Firebase
        const token = await getToken(messaging);
        console.log("FCM Token:", token);
        const userResponse = await axios.get(
          `${baseURL}/api/User/get-current-user`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        const currentUserID = userResponse.data.id;

        if (currentUserID) {
          const payload = { Token: token, UserID: currentUserID };
          const res = await axios.post(
            `${baseURL}/api/Firebase/save-token`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${cookies.get("token")}`,
              },
            }
          );
          console.log("Save token", res);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
        </div>
        <div className="">
          <Select
            onValueChange={(value) => setMonth(parseInt(value as string))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0">All Time</SelectItem>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Admins</h2>
            <p className="text-4xl font-bold">{stats.totalAdmins}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Bloggers</h2>
            <p className="text-4xl font-bold">{stats.totalBloggers}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Inactive User</h2>
            <p className="text-4xl font-bold">{stats.totalInactiveUsers}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Blog</h2>
            <p className="text-4xl font-bold">{stats.totalBlogs}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Comment</h2>
            <p className="text-4xl font-bold">{stats.totalComments}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Reaction</h2>
            <p className="text-4xl font-bold">{stats.totalReactions}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Like</h2>
            <p className="text-4xl font-bold">{stats.totalLikes}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total DisLike</h2>
            <p className="text-4xl font-bold">{stats.totalDislikes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
