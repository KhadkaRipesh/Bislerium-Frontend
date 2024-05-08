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
import { Label } from "@/components/ui/label";
import { UserContext } from "@/useContext/UserProvider";
import { useContext } from "react";
import { useCookies } from "next-client-cookies";

const formSchema = z.object({
  email: z.string().email({ message: "Enter valid email address." }),
  password: z.string().min(2, {
    message: "Enter password",
  }),
});

const SignIn = () => {
  const router = useRouter();
  const cookies = useCookies();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const sanitizedEmail = DOMPurify.sanitize(values.email);
      const sanitizedPassword = DOMPurify.sanitize(values.password);
      const res = await axios.post(
        `${baseURL}/api/User/login`,
        {
          email: sanitizedEmail,
          password: sanitizedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Signed in successfully");
        const tokens = res.data.accessToken;
        cookies.set("token", tokens, {
          path: "/",
          sameSite: "strict",
          secure: true,
          expires: 60 * 60 * 24,
        });

        if (res.data.roleName === "ADMIN") {
          router.push("/admin/home");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      form.reset();
      toast.error("Username or password is incorrect");
    }
  };

  return (
    <>
      <div className="px-8 md:px-32 lg:px-20 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full sm:w-3/4 lg:w-1/2 xl:w-[30%] p-10 rounded-3xl bg-white shadow-md">
          <h1 className="font-extrabold text-[24px]  mb-5">Sign In</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 flex flex-col"
            >
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
                        id="password"
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

export default SignIn;
