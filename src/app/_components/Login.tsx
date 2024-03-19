"use client";
import { CustomInput } from "@/components/Input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loginUserSchema, type LoginUserInput } from "@/lib/user-schema";
import { loginStateAtom } from "@/store/atom";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface LoginProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ open, setOpen, openRegister }: LoginProps) {
  const [loginState, setLoginState] = useAtom(loginStateAtom);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const { mutate, isPending } = api.auth.loginUser.useMutation({
    onError: (error) => {
      toast.error(error.message);
      reset({ password: "" });
    },
    onSuccess: (data, variables, context) => {
      toast.success("Login successful");
      setLoginState(true);
      reset();
      localStorage.setItem("user-detail", JSON.stringify(data.user));
      document.cookie = `token=${data.token}`;
      setOpen(false);
    },
  });

  function onSubmit(data: LoginUserInput) {
    mutate({
      email: data.email,
      password: data.password,
    });
    console.log(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Login with Email & Password</DialogTitle>
          </DialogHeader>

          <div className="mt-5 grid gap-4 py-4">
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

            <span className="self-center text-sm italic">
              <span className="mr-2">Don&apos;t have account</span>
              <Button
                type="button"
                variant="link"
                className="text-primary"
                onClick={() => {
                  setOpen(false);
                  openRegister(true);
                }}
              >
                Register now!
              </Button>
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Login;
