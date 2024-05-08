import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeComment from "./LikeComment";
import DislikeComment from "./DislikeComment";
import DeleteComment from "./DeleteComment";
import { UserContext } from "@/useContext/UserProvider";

const Comments = ({ blog }: { blog: Blog | undefined }) => {
  const { user } = useContext(UserContext);

  const cookie = useCookies();

  const [comments, setComment] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/Comment/get-comment-by-blog/${blog?.slug}`,
          {
            headers: {
              Authorization: `Bearer ${cookie.get("token")}`,
            },
          }
        );
        setComment(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, [cookie, blog?.slug]);

  return (
    <div>
      {comments ? (
        <div>
          {comments.map((comment: Comment) => (
            <div key={comment.id} className="flex items-center gap-5">
              <Avatar>
                <AvatarImage src={`${baseURL}${comment.user?.image}`} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <p className="text-sm"> {comment.user?.userName}</p>
                  <Dot />
                  <span className="text-sm">
                    {new Date(comment?.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <p className="tracking-wide">{comment.body}</p>
                </div>
                <div>
                  <LikeComment blog={blog} comment={comment} />
                  <DislikeComment blog={blog} comment={comment} />
                  {comment.user.id === user.id && (
                    <DeleteComment comment={comment} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No comments yet</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
