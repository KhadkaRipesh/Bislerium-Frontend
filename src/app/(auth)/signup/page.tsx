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
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { useCookies } from "next-client-cookies";
import { Label } from "@/components/ui/label";

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

const SignUp = () => {
  const router = useRouter();
  const cookies = useCookies();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.password !== values.confirmPassword) {
        toast.error("Password and confirm password does not match");
        return;
      }

      const sanitizedEmail = DOMPurify.sanitize(values.email);
      const sanitizedPassword = DOMPurify.sanitize(values.password);

      const formData = new FormData();
      formData.append("UserName", values.username);
      formData.append("Email", sanitizedEmail);
      formData.append("Password", sanitizedPassword);
      formData.append("Role", "BLOGGER");
      if (values.image) {
        formData.append("Image", values.image);
      }
      const res = await axios.post(`${baseURL}/api/User/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res.status === 200) {
        toast.success("Signed in successfully");
        const tokens = res.data.accessToken;
        cookies.set("token", tokens, {
          path: "/",
          sameSite: "strict",
          secure: true,
          expires: 60 * 60 * 24,
        });
        router.push("/");
      }
    } catch (error: any) {
      form.reset();
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <div className="px-8 md:px-32 lg:px-20 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full sm:w-3/4 lg:w-1/2 xl:w-[30%] p-10 rounded-3xl bg-white shadow-md">
          <h1 className="font-extrabold text-[24px]  mb-5">Sign Up</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 flex flex-col"
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
                className="flex-1"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
