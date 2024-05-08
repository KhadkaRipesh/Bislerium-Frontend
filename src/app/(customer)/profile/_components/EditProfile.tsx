import React, { useContext, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/useContext/UserProvider";
import { baseURL } from "@/core/constant/base_url";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  userName: z.string().optional(),
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

const EditProfile = () => {
  const cookies = useCookies();
  const { user } = useContext(UserContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user?.userName,
      image: user?.image,
    },
  });

  const { isSubmitting } = form.formState;
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("UserName", values.userName ?? "");
      if (values.image) {
        formData.append("Image", values.image);
      }

      const res = await axios.put(
        `${baseURL}/api/User/update/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Profile Updated Successfully");
        form.reset();
        setSubmitting(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      form.reset();
      setSubmitting(false);
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
        <Button variant="secondary" size="sm">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="userName" className="text-sm font-semibold">
                      Name
                    </Label>
                    <FormControl>
                      <Input
                        id="userName"
                        disabled={isSubmitting}
                        placeholder="Enter name"
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

              <div className="flex items-center gap-x-2 pt-4 float-end">
                {submitting ? (
                  <Button className="gap-2" disabled>
                    <Loader2 className="animate-spin" />
                    Updating Profile
                  </Button>
                ) : (
                  <Button type="submit">Update Profile</Button>
                )}
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
