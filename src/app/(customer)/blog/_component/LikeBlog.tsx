import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import { UserContext } from "@/useContext/UserProvider";
import axios from "axios";
import { ThumbsUp } from "lucide-react";
import { useCookies } from "next-client-cookies";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const LikeBlog = ({ blog }: { blog: Blog | undefined }) => {
  const cookie = useCookies();

  const { user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/Reaction`, {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        });

        if (response.status === 200) {
          const getLikeByBlogID = () => {
            return response.data.filter(
              (item: Reaction) =>
                item.blogID === blog?.id &&
                item.commentID == null &&
                item.type === 0
            );
          };

          const getLikeByBlogIDAndUserID = () => {
            return response.data.filter(
              (item: Reaction) =>
                item.blogID === blog?.id &&
                item.userID === user?.id &&
                item.commentID === null &&
                item.type === 0
            );
          };

          setIsLiked(getLikeByBlogIDAndUserID().length > 0);
          setLikeCount(getLikeByBlogID().length);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [blog?.id, cookie, user?.id]);

  const handleLike = async () => {
    if (!user || Object.keys(user).length === 0) {
      toast.error("You need to login to like this blog");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/Reaction`,
        {
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
        setIsLiked(true);
        setLikeCount(likeCount + 1);

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
      onClick={handleLike}
      disabled={isLiked}
    >
      <ThumbsUp className="w-4 h-4 mr-4" />
      {likeCount > 0 ? likeCount : ""}
    </Button>
  );
};

export default LikeBlog;
