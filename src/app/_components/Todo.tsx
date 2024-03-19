"use client";
import { api } from "@/trpc/react";
import { Todo } from "@prisma/client";
import { format } from "date-fns";

import { selectedCategoryAtom } from "@/store/atom";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import Categories from "./Categories";
import ListItem from "./TodoList";

interface TodoProps {
  todosData: Todo[];
}
const today = new Date();

function Todo({ todosData }: TodoProps) {
  const [todos, setTodos] = useState(todosData);

  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);

  const utils = api.useUtils();
  const addTask = api.todo.createTodo.useMutation({
    onSuccess: (data, variables) => {
      // setTodos((prev) => {
      //   return [
      //     {
      //       categoryId: null,
      //       createdAt: new Date(),
      //       id: Math.random().toString(),
      //       isCompleted: false,
      //       title: variables.text,
      //       updatedAt: new Date(),
      //       userId: "1",
      //     },
      //     ...prev,
      //   ];
      // });
    },
    onError(error, variables, context) {
      setTodos((prev) => {
        return prev.filter((t) => t.title !== variables.text);
      });
    },
    onMutate: async ({ text }) => {
      await utils.todo.getTodos.cancel();
      const tasks = todos ?? [];

      utils.todo.getTodos.setData({ page: 1 }, [
        ...tasks,
        {
          categoryId: "1",
          createdAt: new Date(),
          id: Math.random().toString(),
          isCompleted: false,
          title: text,
          updatedAt: new Date(),
          userId: "1",
        },
      ]);
    },
  });

  function handleAddTodo(params: { text: string }) {
    setTodos((prev) => {
      return [
        {
          categoryId: null,
          createdAt: new Date(),
          id: Math.random().toString(),
          isCompleted: false,
          title: params.text,
          updatedAt: new Date(),
          userId: "1",
        },
        ...prev,
      ];
    });
    addTask.mutate(params);
  }

  const filteredTodos = useMemo(() => {
    if (selectedCategory === null) {
      return todos;
    }
    return todos.filter((todo) => todo.categoryId === selectedCategory);
  }, [selectedCategory, todos]);

  return (
    <>
      <section className="text-center">
        <h1 className="text-5xl">{format(today, "EEEE")}</h1>
        <span className="text-lg text-400">
          {format(today, "MMM dd, yyyy")}
        </span>
      </section>
      <section className="mt-5 md:mt-10">
        <label htmlFor="new-todo" className="sr-only">
          Create todo
        </label>
        <input
          className="border-input w-full
          rounded-[10px]
          border
          border-500
          bg-900/10
          px-3
          py-2
          text-sm
          ring-300 placeholder:italic placeholder:text-900/20 focus-visible:outline-none
          focus-visible:ring-0
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-50
          dark:placeholder:text-50/20"
          id="new-todo"
          placeholder={"Add a task..."}
          autoFocus
          onKeyDown={(e) => {
            const text = e.currentTarget.value.trim();
            if (e.key === "Enter" && text) {
              handleAddTodo({ text });
              e.currentTarget.value = "";
            }
          }}
        />
      </section>
      <Categories />
      <section className="mt-10">
        <ul className="space-y-5">
          {filteredTodos.length > 0 &&
            filteredTodos.map((todo, index) => {
              return <ListItem task={todo} key={index} setTodo={setTodos} />;
            })}
          {filteredTodos.length === 0 && (
            <li className="text-center text-400">
              No tasks found for this category
            </li>
          )}
        </ul>
      </section>
    </>
  );
}

export default Todo;
