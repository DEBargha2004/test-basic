import { getWishlistOfUserBasic } from "@/actions/test";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { wishlistsAtom } from "@/store/wishlist";
import { PopoverClose } from "@radix-ui/react-popover";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";
import { TestCardMiniView } from "../test-card-mini-view";

export default function Favourites({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlists, setWishlists] = useAtom(wishlistsAtom);

  useEffect(() => {
    getWishlistOfUserBasic().then((res) => {
      if (res.success) {
        setWishlists(
          res.data?.map((t) => ({
            id: t.id!,
            title: t.title!,
            thumbnail: t.thumbnail,
            attemptsCount: t.attemptsCount,
            createdAt: t.createdAt!,
            thumbnailPath: t.thumbnail ?? "",
          })) ?? []
        );
      }
    });
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex flex-col justify-start items-center  p-0">
        <div className="p-4 w-full space-y-2">
          {!wishlists.length && (
            <p className="text-center">Your Wishlist is empty</p>
          )}
          {wishlists.map((test) => (
            <TestCardMiniView
              key={test.id}
              title={test.title}
              id={test.id}
              thumbnailPath={test.thumbnailPath}
              attemptsCount={test.attemptsCount}
              createdAt={test.createdAt}
            />
          ))}
        </div>
        <Separator />
        <div className="p-4 w-full">
          <PopoverClose asChild>
            <Link href={"/"}>
              <Button className="w-full" variant={"secondary"}>
                Explore Exams
              </Button>
            </Link>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
