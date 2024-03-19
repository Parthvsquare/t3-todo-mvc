import { type Category } from "@prisma/client";
import { atom } from "jotai";

const categoryAtom = atom<Category[]>([]);
const selectedCategoryAtom = atom<Category["id"] | null>(null);
const loginStateAtom = atom<boolean>(false);

export { categoryAtom, selectedCategoryAtom, loginStateAtom };
