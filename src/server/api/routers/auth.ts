import { createUserSchema, loginUserSchema } from "@/lib/user-schema";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  loginHandler,
  logoutHandler,
  registerHandler,
} from "../utils/auth-controller";

export const authRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(createUserSchema)
    .mutation(({ input, ctx }) => registerHandler({ input, ctx })),

  loginUser: publicProcedure
    .input(loginUserSchema)
    .mutation(({ input, ctx }) => loginHandler({ input, ctx: ctx })),

  // logoutUser: protectedProcedure.mutation(() => logoutHandler()),

  //todo make this protected route
  logoutUser: publicProcedure.mutation(() => logoutHandler()),
});
