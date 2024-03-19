"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loginStateAtom } from "@/store/atom";
import { api } from "@/trpc/react";
import { type User } from "@prisma/client";
import { useAtom } from "jotai";
import { toast } from "react-toastify";

interface LogoutProps {
  getUserDetail: Omit<User, "password">;
}

function Logout({ getUserDetail }: LogoutProps) {
  const [loginState, setLoginState] = useAtom(loginStateAtom);

  const logoutMutation = api.auth.logoutUser.useMutation({
    onSuccess: (data, variables) => {
      setLoginState(false);
      localStorage.removeItem("user-detail");
      document.cookie
        .split(";")
        .forEach(
          (c) =>
            (document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)),
        );
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/26404957?v=4"
            alt="@pvsquare"
          />
          <AvatarFallback>PV</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-2">
        <DropdownMenuLabel className="capitalize">
          Hello {getUserDetail.name ?? "User"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        <DropdownMenuItem>
          <span className="italic text-opacity-70">v0.0.1</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Logout;
