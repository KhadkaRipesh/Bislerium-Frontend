"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  currentPassword: z.string().min(2, {
    message: "Enter old password",
  }),
  newPassword: z.string().min(2, {
    message: "Enter new password",
  }),
  confirmPassword: z.string().min(2, {
    message: "Enter confirm password",
  }),
});

const ChangePassword = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);

      const res = await axios.post(
        `${baseURL}/api/User/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Password changed successfully");
        Cookies.remove("token");
        setSubmitting(false);
        router.push("/signin");
      }
    } catch (error) {
      setSubmitting(false);
      if (axios.isAxiosError(error)) {
        // Assuming the error is an AxiosError, you can access the response data
        const axiosError = error;
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
    <>
      <div className="px-2 lg:px-20 flex justify-center items-center">
        <div className="w-full xl:w-[50%] p-10 rounded-3xl bg-white">
          <h1 className="font-extrabold text-[24px] text-[#26094a] mb-5">
            Change Password
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Current Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="New Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="flex items-center gap-2 w-full">
                {submitting ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
