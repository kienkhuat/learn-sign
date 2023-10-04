import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import AddWordDialog from "./AddWordDialog";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDebounce } from "use-debounce";

type PrivateProps = {
  _refetch: (...args: any[]) => any;
  _setSearchInput: (...args: any[]) => any;
};

export default function WordToolbar(props: PrivateProps) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    props._setSearchInput(searchInput);
  }, [searchInput]);

  const { data: sessionData } = useSession();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchInput(input);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 pb-5 pt-5">
      <div>
        <Input
          className="min-w-[320px] dark:bg-neutral-950 dark:text-gray-300"
          type="text"
          placeholder="Tìm kiếm..."
          onKeyDown={(e) => handleSearch(e)}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </div>
      {sessionData?.user.role === "admin" ? (
        <Button
          onClick={() => setOpen(true)}
          className="dark:bg-neutral-900 dark:text-white dark:hover:text-black"
          size="icon"
        >
          <PlusIcon />
        </Button>
      ) : (
        <div></div>
      )}
      <AddWordDialog
        isOpen={open}
        _setIsOpen={setOpen}
        _refetch={props._refetch()}
      />
    </div>
  );
}
