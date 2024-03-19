"use client";
import React, { Suspense, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userZod } from "@/lib/custom-types";
import { cn } from "@/lib/utils";
import { type User } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import Login from "./_components/Login";
import Logout from "./_components/Logout";
import Register from "./_components/Register";
import { ModeToggle } from "./_components/ToggleMode";
import { useAtom } from "jotai";
import { loginStateAtom } from "@/store/atom";

type Color = (typeof colorList)[number];

export default function Home({ children }: { children: React.ReactNode }) {
  const [color, setColor] = React.useState<Color>("orange");
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [loginState, setLoginState] = useAtom(loginStateAtom);

  const getUserDetail: Omit<User, "password"> | undefined = useMemo(() => {
    try {
      const value = JSON.parse(
        localStorage.getItem("user-detail") ?? "{}",
      ) as unknown;
      const user = userZod.safeParse(value);
      if (!user.success) {
        return undefined;
      }
      return {
        ...user.data,
        verified: true,
      };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, [loginState]);

  return (
    <>
      <div className={`${color} font-inter`}>
        <header className="">
          <nav className="flex items-center justify-between p-4">
            <div className="flex items-center gap-x-4">
              <Suspense>
                {getUserDetail?.id ? (
                  <Logout getUserDetail={getUserDetail} />
                ) : (
                  <Login
                    open={openLogin}
                    openRegister={setOpenRegister}
                    setOpen={setOpenLogin}
                  />
                )}
                <Register
                  open={openRegister}
                  setOpen={setOpenRegister}
                  openLogin={setOpenLogin}
                />
              </Suspense>
              <span>Todo List</span>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="space-x-2">
                    <span>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </span>
                    <ChevronDown size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {colorList.map((c, index) => (
                    <DropdownMenuItem
                      className={cn(
                        "lg:hover:text-primary cursor-pointer",
                        color === c && "bg-slate-500",
                      )}
                      onClick={() => setColor(c)}
                      key={c + index}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </nav>
        </header>
        <main className="h-[calc(100vh_-_88px)]">{children}</main>
        {!getUserDetail?.id && (
          <div className="sticky bottom-0 w-full bg-200 text-center italic text-900">
            Please login to keep your todos
          </div>
        )}
      </div>
    </>
  );
}

const colorList = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;
