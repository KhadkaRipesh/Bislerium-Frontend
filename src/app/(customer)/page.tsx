"use client";

import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import { useEffect, useState } from "react";
import BlogCard from "./_components/BlogCard";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import Cookies from "js-cookie";

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

export default function CustomerHomePage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    setToken();
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
              Authorization: `Bearer ${Cookies.get("token")}`,
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
                Authorization: `Bearer ${Cookies.get("token")}`,
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
