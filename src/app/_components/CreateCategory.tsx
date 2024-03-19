"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Category } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface CreateCategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const schema = z.object({
  categoryName: z.string().refine((value) => !/\s/.test(value), {
    message: "CategoryName cannot contain spaces",
  }),
});

export type IFormInput = z.infer<typeof schema>;

function CreateCategory({ open, setOpen, setCategories }: CreateCategoryProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
  });

  const createCategory = api.category.createCategory.useMutation({
    onSuccess: (data, variables) => {
      setOpen(false);
    },
    onMutate: async ({ data }) => {
      await utils.category.getCategories.invalidate();
    },
    onError(error, variables, context) {
      setCategories((prev) => {
        return prev.filter((c) => c.name !== variables.data.name);
      });
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = ({ categoryName }) => {
    setCategories((prev) => {
      return [
        ...prev,
        {
          id: Math.random().toString(),
          name: categoryName,
          userId: "1",
        },
      ];
    });
    // todo if unath then close the open

    createCategory.mutate({ data: { name: categoryName } });
  };

  const utils = api.useUtils();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Create Category</span>
          <PlusCircleIcon size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new category</DialogTitle>
          <DialogDescription>Create a new unique category</DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="border-primary w-full rounded-md border-2 p-2"
              placeholder="Category name"
              {...register("categoryName")}
            />
            <p className="text-danger-06 pt-1 text-xs italic">
              {errors.categoryName?.message}
            </p>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                variant="outline"
                disabled={createCategory.isPending}
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategory;
