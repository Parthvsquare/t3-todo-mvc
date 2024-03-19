import { type CreateUserInput, type LoginUserInput } from "@/lib/user-schema";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import jwt, { type Secret } from "jsonwebtoken";

type Context =
  | {
      user: null;
      db: PrismaClient<
        {
          log: ("query" | "warn" | "error")[];
        },
        never,
        DefaultArgs
      >;
    }
  | {
      user: {
        id: string;
        email: string;
        verified: boolean;
        name: string | null;
      };
      db: PrismaClient<
        {
          log: ("query" | "warn" | "error")[];
        },
        never,
        DefaultArgs
      >;
    };

export const registerHandler = async ({
  input,
  ctx,
}: {
  input: CreateUserInput;
  ctx: Context;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await ctx.db.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;

    const secret: Secret = process.env.JWT_SECRET ?? "secret";

    const token = jwt.sign({ sub: user.id }, secret, {
      expiresIn: 60 * 60,
    });

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
    };

    cookies().set("token", token, cookieOptions);

    return {
      status: "success",
      token: token,
      data: {
        user: userWithoutPassword,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already exists",
      });
    }
    throw err;
  }
};

export const loginHandler = async ({
  input,
  ctx,
}: {
  input: LoginUserInput;
  ctx: Context;
}) => {
  try {
    const user = await ctx.db.user.findUnique({
      where: { email: input.email },
    });

    const compare = await bcrypt.compare(input.password, user?.password ?? "");

    if (!user || !compare) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid email or password",
      });
    }

    const secret: Secret = process.env.JWT_SECRET ?? "secret";

    const token = jwt.sign({ sub: user.id }, secret, {
      expiresIn: 60 * 600,
    });

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
    };

    cookies().set("token", token, cookieOptions);

    cookies().set("test", "test");
    return {
      status: "success",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw err;
  }
};

export const logoutHandler = async () => {
  try {
    cookies().set("token", "", {
      maxAge: -1,
    });
    return { status: "success" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw err;
  }
};
