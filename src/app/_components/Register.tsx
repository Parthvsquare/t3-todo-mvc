"use client";
import { CustomInput } from "@/components/Input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createUserSchema, type CreateUserInput } from "@/lib/user-schema";
import { loginStateAtom } from "@/store/atom";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface RegisterProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register({ open, setOpen, openLogin }: RegisterProps) {
  const [loginState, setLoginState] = useAtom(loginStateAtom);
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const { mutate, isPending } = api.auth.registerUser.useMutation({
    onError: (error) => {
      toast.error(error.message);
      reset({ password: "", passwordConfirm: "" });
    },
    onSuccess: (data, variables, context) => {
      toast.success("Login successful");
      setLoginState(true);
      reset();
      localStorage.setItem("user-detail", JSON.stringify(data.data.user));
      document.cookie = `token=${data.token}`;
      setOpen(false);
    },
  });
  function onSubmit(data: CreateUserInput) {
    if (data.password !== data.passwordConfirm) {
      toast.error("Password and Confirm Password should be same");
      return;
    }
    mutate({
      email: data.email,
      password: data.password,
      name: data.name,
      passwordConfirm: data.passwordConfirm,
    });
    console.log(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Login with Email & Password</DialogTitle>
          </DialogHeader>

          <div className="mt-5 grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <CustomInput
                {...register("name")}
                type="name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4">
              <div />
              <p className="col-span-3 ml-2 text-xs italic text-red-700">
                {errors.name?.message}
              </p>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Email
              </label>
              <CustomInput
                {...register("email")}
                type="email"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4">
              <div />
              <p className="col-span-3 ml-2 text-xs italic text-red-700">
                {errors.email?.message}
              </p>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right">
                Password
              </label>
              <CustomInput
                {...register("password")}
                type="password"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4">
              <div />
              <p className="col-span-3 ml-2 text-xs italic text-red-700">
                {errors.password?.message}
              </p>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right">
                Confirm Password
              </label>
              <CustomInput
                {...register("passwordConfirm")}
                type="password"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4">
              <div />
              <p className="col-span-3 ml-2 text-xs italic text-red-700">
                {errors.passwordConfirm?.message}
              </p>
            </div>
          </div>
          <DialogFooter>
            <span className="self-center text-sm italic">
              <span className="mr-2">Already have an Account</span>
              <Button
                variant="outline"
                className="text-primary"
                onClick={() => {
                  setOpen(false);
                  openLogin(true);
                  clearErrors();
                }}
              >
                Login now!
              </Button>
            </span>
            <Button type="submit" disabled={isPending}>
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
