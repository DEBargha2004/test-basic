import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SafeRemove({
  children,
  title,
  description,
  action,
  actionLabel,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action: () => void;
  actionLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await action();
    setLoading(false);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>
          <DialogDescription>
            {description ??
              "This is an irreversible action and cannot be undone"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={handleDelete}>
            {loading && <Loader2 className="animate-spin" />}
            <span>{actionLabel ?? "Delete"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
