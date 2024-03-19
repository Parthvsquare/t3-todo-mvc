"use client";
import { CheckBoxInput } from "@/components/InputCheckbox";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/useClickOusite";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type Todo } from "@prisma/client";
import { PencilIcon, Trash2Icon } from "lucide-react";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAtom } from "jotai";
import { categoryAtom } from "@/store/atom";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type IUpdateTodo } from "@/lib/custom-types";
import { debounce } from "lodash";

export default function ListItem(props: {
  task: Todo;
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
}) {
  const { task, setTodo } = props;
  const [categories, setCategories] = useAtom(categoryAtom);

  const [editing, setEditing] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();

  const [text, setText] = useState(task.title);

  useEffect(() => {
    setText(task.title);
  }, [task.title]);

  const editTask = api.todo.updateTodo.useMutation({
    onMutate: async ({ id, data }) => {
      await utils.todo.getTodos.cancel();
      const allTasks = utils.todo.getTodos.getData();
      if (!allTasks) {
        return;
      }

      await utils.todo.getTodos.invalidate();
      utils.todo.getTodos.setData(
        { page: 1 },
        allTasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...data,
              }
            : t,
        ),
      );
    },
  });

  function handleEdit({ id, data }: IUpdateTodo) {
    setTodo((prev) => {
      return prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ...data,
          };
        }
        return t;
      });
    });
    const debouncedEditTodo = debounce(() => {
      editTask.mutate({ id, data });
    }, 300); // 300ms debounce time
    debouncedEditTodo();

    setEditing(false);
  }

  const deleteTask = api.todo.deleteTodo.useMutation({
    onSuccess: (data, variables) => {
      setTodo((prev) => {
        return prev.filter((t) => t.id !== variables.id);
      });
    },
    onMutate: async () => {
      await utils.todo.getTodos.cancel();
      const allTasks = utils.todo.getTodos.getData();
      if (!allTasks) {
        return;
      }
      setTodo(allTasks.filter((t) => t.id !== task.id));
      utils.todo.getTodos.setData(
        { page: 1 },
        allTasks.filter((t) => t.id !== task.id),
      );
    },
  });

  useClickOutside({
    ref: wrapperRef,
    enabled: editing && !dropDownOpen,
    callback() {
      handleEdit({ id: task.id, data: { text: text ?? undefined } });
      setEditing(false);
    },
  });

  const categoryForTodo = useMemo(() => {
    return (
      categories.find((c) => c.id === task.categoryId)?.name ?? "Uncategorized"
    );
  }, [categories, task.categoryId]);

  return (
    <li
      className={cn(
        editing && "editing",
        task.isCompleted && "completed",
        "flex items-center justify-start gap-5 rounded-lg border-b border-500 px-3 py-2 shadow-md shadow-900/25  dark:border-600",
      )}
      ref={wrapperRef}
    >
      <div className="flex w-full items-center justify-between">
        <div className={cn("flex items-center", !editing && "w-full")}>
          <CheckBoxInput
            type="checkbox"
            key={task.id}
            checked={task.isCompleted}
            onChange={(e) => {
              const checked = e.currentTarget.checked;
              handleEdit({ id: task.id, data: { isCompleted: checked } });
            }}
            autoFocus={editing}
            disabled={editing}
            className={cn(editing && "opacity-80")}
          />
          <label
            onDoubleClick={(e) => {
              setEditing(true);
              e.currentTarget.focus();
            }}
            className={cn(
              editing && "hidden",
              "basis-full py-3",
              task.isCompleted &&
                "italic text-gray-500 line-through decoration-800",
            )}
          >
            {text}
          </label>
        </div>

        <input
          className={cn(
            `border-input mr-2
            w-full
            rounded-[10px]
            border
            border-500
            bg-900/10
            px-3
            py-2
            text-sm ring-300 placeholder:text-900/20
            focus-visible:outline-none
            focus-visible:ring-0
            focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:placeholder:text-50/20
            `,
            !editing && "hidden",
          )}
          value={text ?? ""}
          ref={inputRef}
          onChange={(e) => {
            const newText = e.currentTarget.value;
            setText(newText);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleEdit({ id: task.id, data: { text: text ?? undefined } });
              setEditing(false);
            }
          }}
        />

        {!editing ? (
          <span
            className={cn("mr-4 rounded-full bg-400/25 px-4 py-2 capitalize")}
            onDoubleClick={(e) => {
              setEditing(true);
              e.currentTarget.focus();
            }}
          >
            {categoryForTodo}
          </span>
        ) : (
          <SetCategoryForTodo
            editTask={handleEdit}
            open={dropDownOpen}
            setOpen={setDropDownOpen}
            currentCategory={categoryForTodo}
            taskId={task.id}
          />
        )}
        <Button
          variant="ghost"
          className="mr-4 text-800 dark:text-100"
          onClick={() => {
            setEditing(true);
          }}
          disabled={editing}
        >
          <PencilIcon size={"20"} />
        </Button>
        <Button
          variant="destructive"
          className="dark:bg-red-500"
          onClick={() => {
            deleteTask.mutate({ id: task.id });
          }}
          disabled={editing}
        >
          <Trash2Icon size={"16"} />
        </Button>
      </div>
    </li>
  );
}

function SetCategoryForTodo({
  taskId,
  editTask,
  currentCategory,
  open,
  setOpen,
}: {
  taskId: string;
  editTask: ({ id, data }: IUpdateTodo) => void;
  currentCategory: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [categories, setCategories] = useAtom(categoryAtom);

  function handleValueCategoryChange(params: string) {
    if (params === "") {
      editTask({ id: taskId, data: { categoryId: undefined } });
    } else {
      editTask({ id: taskId, data: { categoryId: params } });
    }
  }

  function handleCategoryChange(value: string) {
    const getCategoryId = categories.find((c) => c.name === value)?.id;

    handleValueCategoryChange(getCategoryId!);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mr-4">
            <span className="capitalize">{currentCategory}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Available Category</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuRadioGroup
            value={currentCategory}
            onValueChange={(value) => handleCategoryChange(value)}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuRadioItem
              value={""}
              className="lg:hover:text-primary cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              Uncategorized
            </DropdownMenuRadioItem>
            {categories.map((c, index) => (
              <DropdownMenuRadioItem
                value={c.name}
                className={cn(
                  "lg:hover:text-primary cursor-pointer capitalize",
                )}
                key={c.id + index}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {c.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
