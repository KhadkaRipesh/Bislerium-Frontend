import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { baseURL } from "@/core/constant/base_url";
import { useCookies } from "next-client-cookies";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username is required and must be at least 3 characters long.",
  }),
  email: z.string().email({ message: "Enter valid email address." }),
  password: z.string().min(2, {
    message: "Enter password",
  }),
  confirmPassword: z.string().min(2, {
    message: "Enter confirm password",
  }),
  image: z
    .instanceof(File, {
      message: "Image is required",
    })
    .refine(
      (value) => {
        const supportedExtensions = [".png", ".jpg", ".jpeg"];
        const extension = value.name
          .substring(value.name.lastIndexOf("."))
          .toLowerCase();
        return supportedExtensions.includes(extension);
      },
      {
        message: "Invalid file format. Please upload a PNG, JPG, or JPEG file.",
      }
    ),
});

const AddAdmin = () => {
  const cookies = useCookies();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      image: undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.password !== values.confirmPassword) {
        toast.error("Password and confirm password does not match");
        return;
      }

      const formData = new FormData();
      formData.append("UserName", values.username);
      formData.append("Email", values.email);
      formData.append("Password", values.password);
      formData.append("Role", "ADMIN");
      if (values.image) {
        formData.append("Image", values.image);
      }
      const res = await axios.post(`${baseURL}/api/User/add/admin`, formData, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success("Admin Added Successfully");
        form.reset();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      form.reset();
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-neutral-800">Add Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6 w-full"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username" className="text-sm font-semibold">
                      Username
                    </Label>
                    <FormControl>
                      <Input
                        id="username"
                        disabled={isSubmitting}
                        placeholder="Enter user name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <Label htmlFor="image" className="text-sm font-semibold">
                      Image
                    </Label>
                    <FormControl>
                      <Input
                        id="image"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        disabled={isSubmitting}
                        onChange={(e) =>
                          form.setValue(
                            "image",
                            e.target.files?.item(0) as File
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        readOnly={isSubmitting}
                        placeholder="Email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password" className="text-sm font-semibold">
                      Password
                    </Label>
                    <FormControl>
                      <Input
                        readOnly={isSubmitting}
                        placeholder="Password"
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
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold"
                    >
                      Confirm Password
                    </Label>
                    <FormControl>
                      <Input
                        readOnly={isSubmitting}
                        placeholder="Confirm Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex-1 w-full"
              >
                Add
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdmin;
