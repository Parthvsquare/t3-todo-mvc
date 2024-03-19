import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.category.findMany({
      where: {
        userId: ctx.user?.id,
      },
      select: {
        id: true,
        name: true,
        userId: true,
      },
    });
  }),
  createCategory: protectedProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string().min(1),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.create({
        data: {
          name: input.data.name.toLowerCase(),
          userId: ctx.user?.id,
        },
        select: {
          id: true,
          name: true,
          userId: true,
        },
      });
    }),
  updateCategory: protectedProcedure
    .input(
      z.object({
        data: z.object({
          id: z.string(),
          name: z.string().min(1),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.update({
        where: {
          id: input.data.id,
        },
        data: {
          name: input.data.name,
        },
      });
    }),
  deleteCategory: protectedProcedure
    .input(
      z.object({
        data: z.object({
          id: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.delete({
        where: {
          id: input.data.id,
        },
      });
    }),

  getTodosWithGivenCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.db.todo.findMany({
        where: {
          categoryId: input.categoryId,
        },
        select: {
          id: true,
          title: true,
          isCompleted: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
        },
      });

      return response;
    }),
});
