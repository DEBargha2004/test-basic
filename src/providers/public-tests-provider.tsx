"use client";

import {
  addToWishlist,
  deleteFromWishlist,
  PublicTestView,
} from "@/actions/test";
import { wishlistsAtom } from "@/store/wishlist";
import { produce } from "immer";
import { useSetAtom } from "jotai";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

type State = {
  tests: PublicTestView[];
};

type Actions = {
  setTests: React.Dispatch<React.SetStateAction<State["tests"]>>;
  handleAddToWishlist: (testId: number) => Promise<void>;
  handleDeleteFromWishlist: (testId: number) => Promise<void>;
};

const publicTestsContext = createContext<(State & Actions) | undefined>(
  undefined
);

export default function PublicTestsProvider({
  children,
  defaultValues,
  removeAfterUnWishlist = false,
}: {
  children: React.ReactNode;
  defaultValues?: PublicTestView[];
  removeAfterUnWishlist?: boolean;
}) {
  const [tests, setTests] = useState<PublicTestView[]>(defaultValues ?? []);
  const setWishlistedTests = useSetAtom(wishlistsAtom);

  const handleAddToWishlist = async (testId: number) => {
    const resp = await addToWishlist(testId.toString());
    const testIndex = tests.findIndex((test) => test.id === testId);
    if (resp.success) {
      toast.success(resp.message);
      setTests(
        produce((tests) => {
          const index = tests.findIndex((test) => test.id === testId);
          if (index !== -1) {
            tests[index].isWishlisted = 1;
          }
        })
      );
      setWishlistedTests((prev) => [
        ...prev,
        {
          id: testId,
          title: tests[testIndex].title,
          thumbnail: tests[testIndex].thumbnail,
          attemptsCount: tests[testIndex].attemptsCount,
          createdAt: tests[testIndex].createdAt,
          thumbnailPath: tests[testIndex].thumbnail ?? "",
        },
      ]);
    } else {
      toast.error(resp.message);
    }
  };

  const handleDeleteFromWishlist = async (testId: number) => {
    const resp = await deleteFromWishlist(testId.toString());
    if (resp.success) {
      toast.success(resp.message);
      setTests(
        produce((tests) => {
          const index = tests.findIndex((test) => test.id === testId);
          if (index !== -1) {
            tests[index].isWishlisted = 0;
            if (removeAfterUnWishlist) {
              tests.splice(index, 1);
            }
          }
        })
      );
      setWishlistedTests((prev) => prev.filter((test) => test.id !== testId));
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <publicTestsContext.Provider
      value={{ setTests, tests, handleAddToWishlist, handleDeleteFromWishlist }}
    >
      {children}
    </publicTestsContext.Provider>
  );
}

export const usePublicTests = () => {
  const context = useContext(publicTestsContext);

  if (!context)
    throw new Error("usePublicTests must be used within PublicTestsProvider");

  return context;
};
