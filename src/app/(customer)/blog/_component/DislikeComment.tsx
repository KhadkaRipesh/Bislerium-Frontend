import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import { UserContext } from "@/useContext/UserProvider";
import axios from "axios";
import { ThumbsDown } from "lucide-react";
import { useCookies } from "next-client-cookies";
import React, { useContext, useEffect, useState } from "react";

const DislikeComment = ({
  blog,
  comment,
}: {
  blog: Blog | undefined;
  comment: Comment;
}) => {
  const cookie = useCookies();

  const { user } = useContext(UserContext);
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

        if (response.status === 200) {
          const getDislikeByBlogIDAndCommentID = () => {
            return response.data.filter(
              (item: Reaction) =>
                item.blogID === blog?.id &&
                item.commentID === comment.id &&
                item.type === 1
            );
          };

          const getDislikeByBlogIDAndCommentIDAndUserID = () => {
            return response.data.filter(
              (item: Reaction) =>
                item.blogID === blog?.id &&
                item.commentID === comment.id &&
                item.userID === user?.id &&
                item.type === 1
            );
          };

          setIsDisliked(getDislikeByBlogIDAndCommentIDAndUserID().length > 0);
          setDislikeCount(getDislikeByBlogIDAndCommentID().length);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [blog?.id, comment.id, cookie, user?.id]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/Reaction`,
        {
          BlogID: blog?.id,
          CommentID: comment.id,
          Type: "dislike",
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
    <Button variant="link" size="sm" onClick={handleLike} disabled={isDisliked}>
      <ThumbsDown className="w-4 h-4 mr-4" />
      {dislikeCount > 0 ? dislikeCount : ""}
    </Button>
  );
};

export default DislikeComment;
