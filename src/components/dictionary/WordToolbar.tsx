import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import AddWordDialog from "./AddWordDialog";

type PrivateProps = {
  _refetch: Function;
};

export default function WordToolbar(props: PrivateProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 pb-5 pt-3">
      <div>
        <Input
          className="min-w-[320px] dark:bg-neutral-950 dark:text-gray-300"
          type="text"
          placeholder="Tìm kiếm..."
        />
      </div>
      <Button
        onClick={() => setOpen(true)}
        className="dark:bg-neutral-900 dark:text-white dark:hover:text-black"
        size="icon"
      >
        <PlusIcon />
      </Button>
      <AddWordDialog
        isOpen={open}
        _setIsOpen={setOpen}
        _refetch={props._refetch}
      />
    </div>
  );
}
