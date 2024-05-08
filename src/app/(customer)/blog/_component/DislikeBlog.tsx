import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import { UserContext } from "@/useContext/UserProvider";
import axios from "axios";
import { ThumbsDown } from "lucide-react";
import { useCookies } from "next-client-cookies";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const DislikeBlog = ({ blog }: { blog: Blog | undefined }) => {
  const cookie = useCookies();

  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/Reaction`, {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        });
        setData(response.data);

        if (response.status === 200) {
          const getDislikeByBlogID = () => {
            return response.data.filter(
              (item: Reaction) => item.blogID === blog?.id && item.type === 1
            );
          };

          const getDislikeByBlogIDAndUserID = () => {
            return response.data.filter(
              (item: Reaction) =>
                item.blogID === blog?.id &&
                item.userID === user?.id &&
                item.type === 1
            );
          };

          setIsDisliked(getDislikeByBlogIDAndUserID().length > 0);
          setDislikeCount(getDislikeByBlogID().length);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [blog?.id, cookie, user?.id]);

  const handleDislike = async () => {
    if (!user || Object.keys(user).length === 0) {
      toast.error("You need to login to like this blog");
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/api/Reaction`,
        {
          BlogID: blog?.id,
          Type: "dislike",
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data);

      if (response.status === 200) {
        setIsDisliked(true);
        setDislikeCount(dislikeCount + 1);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleDislike}
      disabled={isDisliked}
    >
      <ThumbsDown className="w-4 h-4 mr-4" />
      {dislikeCount > 0 ? dislikeCount : ""}
    </Button>
  );
};

export default DislikeBlog;
