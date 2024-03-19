"use client";
import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import Todo from "./_components/Todo";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { categoryAtom } from "@/store/atom";

function Page() {
  const [categories, setCategories] = useAtom(categoryAtom);

  const { data, isLoading } = api.todo.getTodos.useQuery(
    { page: 1 },
    {
      staleTime: 3000,
    },
  );
  const { data: category } = api.category.getCategories.useQuery(undefined, {
    staleTime: 3000,
  });

  useEffect(() => {
    if (category) {
      setCategories(category ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (isLoading) {
    return (
      <>
        <section className="text-center">
          <h1 className="text-5xl">{format(new Date(), "EEEE")}</h1>
          <span className="text-lg text-400">
            {format(new Date(), "MMM dd, yyyy")}
          </span>
        </section>
        <div className="mx-auto w-11/12 md:w-4/5">
          <div className="flex h-96 items-center justify-center">
            <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2 border-t-2"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto w-11/12 md:w-4/5">
      <Todo todosData={data ?? []} />
    </div>
  );
}

export default Page;
