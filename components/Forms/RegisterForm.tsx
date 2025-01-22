"use client";
import { Eye, EyeOff, Headset, Loader2, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { createUser } from "@/actions/users";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { Button } from "../ui/button";
import { FaGithub, FaGitter, FaGoogle } from "react-icons/fa";
import { createUser } from "@/actions/users";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserProps>();
  const router = useRouter();
  async function onSubmit(formData: UserProps) {
    setLoading(true);
    setEmailErr(null);

    try {
      // Ensure all required fields are present
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone || "",
        image: "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png",
        role: UserRole.USER,
      };

      // Call the server action
      const result = await createUser(userData);

      if (result.error) {
        setEmailErr(result.error);
        toast.error(result.error);
      } else {
        toast.success("Account Created successfully");
        reset();
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full py-5 lg:px-8 px-6">
      <div className="">
        <div className="py-4 text-gray-900">
          <h2 className="text-xl lg:text-2xl font-bold leading-9 tracking-tight  ">
            Create an account
          </h2>
          <p className="text-xs">Join Us, fill in details to login</p>
        </div>
      </div>
      <div className="">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="First Name"
              name="firstName"
              icon={User}
              placeholder="first Name"
            />
            <TextInput
              register={register}
              errors={errors}
              label="Last Name"
              name="lastName"
              icon={User}
              placeholder="last Name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="Phone"
              name="phone"
              icon={Headset}
              placeholder="phone"
            />
            <div className="">
              <TextInput
                type="email"
                register={register}
                errors={errors}
                label="Email Address"
                name="email"
                icon={Mail}
                placeholder="email"
              />
              {emailErr && (
                <p className="text-red-500 text-xs mt-2">{emailErr}</p>
              )}
            </div>
          </div>

          <PasswordInput
            register={register}
            errors={errors}
            label="Password"
            name="password"
            icon={Lock}
            placeholder="password"
            type="password"
          />
          <div>
            <SubmitButton
              title="Sign Up"
              loadingTitle="Creating Please wait.."
              loading={loading}
              className="w-full"
              loaderIcon={Loader2}
              showIcon={false}
            />
          </div>
        </form>

        <div className="flex items-center py-4 justify-center space-x-1 text-slate-900">
          <div className="h-[1px] w-full bg-slate-200"></div>
          <div className="uppercase">Or</div>
          <div className="h-[1px] w-full bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Button
            onClick={() => signIn("google")}
            variant={"outline"}
            className="w-full"
          >
            <FaGoogle className="mr-2 w-6 h-6 text-red-500" />
            Signup with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant={"outline"}
            className="w-full"
          >
            <FaGithub className="mr-2 w-6 h-6 text-slate-900 dark:text-white" />
            Signup with Github
          </Button>
        </div>

        <p className="mt-6 text-left text-sm text-gray-500">
          Alrealy Registered ?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
