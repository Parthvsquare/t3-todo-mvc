import { type TypeOf, z } from "zod";

export interface IUpdateTodo {
  id: string;
  data: {
    text?: string;
    isCompleted?: boolean;
    categoryId?: string | undefined;
  };
}

export const userZod = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type UserSchema = TypeOf<typeof userZod>;
