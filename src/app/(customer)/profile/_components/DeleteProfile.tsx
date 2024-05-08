import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import { Modal } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash, Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
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
import { useRouter } from "next/navigation";
import { UserContext } from "@/useContext/UserProvider";

const DeleteProfile = () => {
  const router = useRouter();
  const cookies = useCookies();
  const { user } = useContext(UserContext);

  const handleDeleteProfile = () => async () => {
    try {
      const res = await axios.delete(`${baseURL}/api/User/delete`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
      if (res.status === 200) {
        toast.success("User deleted successfully");
        cookies.remove("token");
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        console.log(axiosError);
        if (axiosError.response) {
          toast.error(axiosError.response.data);
        } else {
          toast.error("An error occurred, but no response was received.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-10">
          <p>{`Are you sure you want to delete `}</p>
          <Button
            onClick={handleDeleteProfile()}
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

export default DeleteProfile;
