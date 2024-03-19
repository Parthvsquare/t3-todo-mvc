"use client";
import { cn } from "@/lib/utils";
import { type Category } from "@prisma/client";

import { CustomInput } from "@/components/Input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClickOutside } from "@/hooks/useClickOusite";
import { categoryAtom, selectedCategoryAtom } from "@/store/atom";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { debounce } from "lodash";
import { Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import CreateCategory from "./CreateCategory";

function Categories() {
  const [categories, setCategories] = useAtom(categoryAtom);

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);

  const utils = api.useUtils();

  const editCategory = api.category.updateCategory.useMutation({
    onSuccess: (data, variables) => {
      setCategories((prev) => {
        return prev.map((category) => {
          if (category.id === variables.data.id) {
            return {
              ...category,
              ...variables.data,
            };
          }
          return category;
        });
      });
    },
    onMutate: async () => {
      await utils.category.getCategories.invalidate();
    },
  });

  const deleteCategory = api.category.deleteCategory.useMutation({
    onSuccess: (data, variables) => {
      setOpenAlert({
        id: "",
        open: false,
      });
      setCategories((prev) => {
        return prev.filter((category) => category.id !== variables.data.id);
      });
    },
    onMutate: async () => {
      await utils.category.getCategories.invalidate();
    },
  });

  function handleDelete() {
    deleteCategory.mutate({ data: { id: openAlert.id } });
  }

  function handleEdit(params: { id: string; data: { text: string } }) {
    if (params.data.text === "") {
      setOpenAlert({
        id: params.id,
        open: true,
      });
      return;
    }

    const debouncedEditCategory = debounce(() => {
      editCategory.mutate({
        data: {
          id: params.id,
          name: params.data.text,
        },
      });
    }, 300); // 300ms debounce time

    debouncedEditCategory();
  }
  const [openAlert, setOpenAlert] = useState<{
    id: string;
    open: boolean;
  }>({
    id: "",
    open: false,
  });

  return (
    <>
      <section className="mt-10">
        <div className="flex justify-between">
          <div className="flex gap-x-2">
            <button onClick={() => setSelectedCategory(null)} className="mr-2">
              <span
                className={cn(
                  "rounded-full bg-400/25 px-4 py-2 capitalize",
                  !selectedCategory &&
                    "bg-800 text-white dark:bg-50 dark:text-black",
                )}
              >
                All
              </span>
            </button>
            <div className="flex items-center gap-x-2 overflow-x-scroll">
              {categories.length > 0 &&
                categories.map((category, index) => (
                  <CategoryItem
                    key={category.id + index}
                    category={category}
                    handleEdit={handleEdit}
                    setOpenAlert={setOpenAlert}
                  />
                ))}
            </div>
          </div>
          <CreateCategory
            open={openCategoryDialog}
            setOpen={setOpenCategoryDialog}
            setCategories={setCategories}
          />
        </div>
      </section>
      <AlertDialog open={openAlert.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              category named{" "}
              <span className="font-bold capitalize text-400">
                {
                  categories.filter(
                    (category) => category.id === openAlert.id,
                  )[0]?.name
                }
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setOpenAlert({
                  id: "",
                  open: false,
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Categories;

interface ICategoryItem {
  category: Category;
  handleEdit: (params: { id: string; data: { text: string } }) => void;
  setOpenAlert: React.Dispatch<
    React.SetStateAction<{
      id: string;
      open: boolean;
    }>
  >;
}
function CategoryItem({ category, handleEdit, setOpenAlert }: ICategoryItem) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);

  const [editing, setEditing] = useState<{
    categoryId: string;
    editing: boolean;
  }>({
    categoryId: "",
    editing: false,
  });

  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(category.name);

  useClickOutside({
    ref: wrapperRef,
    enabled: editing.editing,
    callback() {
      handleEdit({ data: { text: category.name }, id: category.id }),
        setEditing({
          categoryId: "",
          editing: false,
        });
    },
  });

  return (
    <button
      ref={wrapperRef}
      onClick={() => setSelectedCategory(category.id)}
      onDoubleClick={() => {
        setEditing({
          categoryId: category.id,
          editing: true,
        });
      }}
    >
      <div
        className={cn(
          editing.categoryId === category.id
            ? "flex items-center gap-x-2 rounded-xl border"
            : "hidden",
        )}
      >
        <CustomInput
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            const newText = e.currentTarget.value;
            setInputValue(newText);
            handleEdit({ data: { text: newText }, id: category.id });
          }}
        />
        <Trash2Icon
          size={"20"}
          className="mr-2"
          onClick={() =>
            setOpenAlert({
              id: category.id,
              open: true,
            })
          }
        />
      </div>
      <span
        className={cn(
          "rounded-full bg-400/25 px-4 py-2 capitalize",
          selectedCategory === category.id &&
            "bg-800 text-white dark:bg-50 dark:text-black",
          editing.categoryId === category.id && "hidden",
        )}
      >
        {category.name}
      </span>
    </button>
  );
}
