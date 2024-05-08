import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import { Modal } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { Pen, Trash, Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Row } from "@tanstack/react-table";
import { useCookies } from "next-client-cookies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditUserProps {
  row: Row<User>;
}

const EditBlogger: React.FC<EditUserProps> = ({ row }) => {
  const cookies = useCookies();

  const handleEditUser = (id: number) => async () => {
    try {
      const res = await axios.put(`${baseURL}/api/User/change/status/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
      if (res.status === 200) {
        toast.success("Status changed successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error changing status");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pen className="w-4 h-4 text-gray-500 " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-10">
          <p>
            {`Are you sure you want to change status of `}
            <span className="font-bold">{`"${row.original.userName}"`}</span>
          </p>
          <Button
            onClick={handleEditUser(row.original.id)}
            className="w-full mt-5"
          >
            Change Status
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogger;
