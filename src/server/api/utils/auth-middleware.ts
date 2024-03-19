import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type PrismaClient } from "@prisma/client";

export const deserializeUser = async (
  opts: { headers: Headers },
  db: PrismaClient<
    {
      log: ("query" | "warn" | "error")[];
    },
    never,
    DefaultArgs
  >,
) => {
  const cookieStore = cookies();
  try {
    let token;
    if (cookieStore.get("token")) {
      token = cookieStore.get("token")?.value;
    }

    const notAuthenticated = {
      user: null,
      db: db,
      ...opts,
    };

    if (!token) {
      return notAuthenticated;
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { sub: string };

    if (!decoded) {
      return notAuthenticated;
    }

    const user = await db.user.findUnique({ where: { id: decoded.sub } });

    if (!user) {
      return notAuthenticated;
    }

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      db: db,
      ...opts,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      message: err.message,
    });
  }
};
