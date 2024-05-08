import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Trash, Trash2 } from "lucide-react";
import axios from "axios";
import { baseURL } from "@/core/constant/base_url";
import { useCookies } from "next-client-cookies";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Notification = () => {
  const cookies = useCookies();
  const token = cookies.get("token");

  const [data, setData] = React.useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/Notification`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    fetchData();
  }, [cookies]);

  const handleDelete = async ({ id }: { id: number }) => {
    try {
      const res = await axios.delete(`${baseURL}/api/Notification/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
      if (res.status === 200) {
        toast.success("Notification deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Bell size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-5">
        {data.map((notification) => (
          <div key={notification.id} className="">
            <div className="flex items-center gap-5 py-1">
              <div>
                <Avatar className="w-full rounded-2xl">
                  <AvatarImage
                    src={`${baseURL}/${notification.user?.image}`}
                    className="object-cover w-10 h-10"
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center justify-between gap-5">
                <div className="first-letter:uppercase">
                  {notification.body}
                </div>
                <div>
                  <Button
                    className="text-xs"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete({ id: notification.id })}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
