"use client";

import React, { useContext, useEffect } from "react";
import { baseURL } from "@/core/constant/base_url";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TipTap from "../../_components/TipTap";
import { Pen } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title is required",
  }),
  summary: z.string().min(5, {
    message: "Summary is required",
  }),
  body: z.string().min(5, {
    message: "Body is required",
  }),
  image: z
    .instanceof(File)
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
    )
    .optional(),
});

const EditBlog = ({ blog }: { blog: Blog }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog.title,
      summary: blog.summary,
      body: blog.body,
      image: undefined,
    },
  });

  const { isSubmitting } = form.formState;
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("summary", values.summary);
      formData.append("body", values.body);
      if (values.image) {
        formData.append("image", values.image);
      }

      const res = await axios.put(`${baseURL}/api/Blog/${blog.id}`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success("Blog updated Successfully");
        form.reset();
        form.setValue("image", undefined);
        setSubmitting(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      form.reset();
      form.setValue("image", undefined);

      setSubmitting(false);

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
        <Button variant="outline" size="icon">
          <Pen className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1000px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold">Title</Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold">Summary</Label>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter summary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <Label className="text-sm font-semibold">Image</Label>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      disabled={isSubmitting}
                      onChange={(e) =>
                        form.setValue("image", e.target.files?.[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-semibold">Content</Label>
                  <FormControl>
                    <TipTap body={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 pt-4">
              <Button type="submit" className="w-full">
                {submitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlog;
