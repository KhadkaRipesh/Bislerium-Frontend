import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useCookies } from "next-client-cookies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

const DeleteComment = ({ comment }: { comment: Comment }) => {
  const cookies = useCookies();

  const handleDeleteComment = () => async () => {
    try {
      const res = await axios.delete(`${baseURL}/api/Comment/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
      if (res.status === 200) {
        toast.success("Comment deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4 text-red-700" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-10">
          <p>{`Are you sure you want to delete `}</p>
          <Button
            onClick={handleDeleteComment()}
            variant="destructive"
            className="w-full mt-5"
          >
            Delete
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteComment;
