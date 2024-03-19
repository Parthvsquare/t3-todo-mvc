import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getTodos: protectedProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.todo.findMany({
        take: 10,
        skip: input.page - 1,
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId: ctx.user?.id,
        },
      });
    }),

  getTaskWithId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.todo.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  createTodo: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        isCompleted: z.boolean().default(false),
        updatedAt: z.date().default(new Date()),
        createdAt: z.date().default(new Date()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.create({
        data: {
          isCompleted: input.isCompleted,
          createdAt: input.createdAt,
          title: input.text,
          updatedAt: input.updatedAt,
          userId: ctx.user?.id,
        },
      });
    }),

  deleteTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          text: z.string().min(1).optional(),
          isCompleted: z.boolean().optional(),
          categoryId: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.data.text,
          isCompleted: input.data.isCompleted,
          categoryId: input.data.categoryId,
          updatedAt: new Date(),
        },
      });
    }),

  clearCompleted: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.todo.deleteMany({
      where: {
        isCompleted: true,
      },
    });
  }),
});
