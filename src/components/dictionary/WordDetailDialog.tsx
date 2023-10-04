import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ReactPlayer from "react-player";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWord: string;
  _refetch: (...args: any[]) => any;
};

export default function WordDetailDialog(props: PrivateProps) {
  const { data: sessionData } = useSession();

  const { data: wordData, refetch: refetchWord } =
    api.dictionary.findWord.useQuery({
      id: props.selectedWord,
    });

  const { mutateAsync: apiDeleteWord, isLoading } =
    api.dictionary.deleteWord.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const handleDeleteWord = async () => {
    await apiDeleteWord({ id: wordData?.id || "" });
    props._setIsOpen(false);
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
      <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white sm:min-w-[800px]">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="text-3xl">{wordData?.word}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex max-h-[600px] flex-col gap-4 overflow-y-scroll p-5 pr-0 pt-3">
          <div className="mb-4 text-xl">{wordData?.definition}</div>
          <div className="min-h-[440px]">
            <ReactPlayer
              width="100%"
              height="100%"
              url={wordData?.videoLink}
              controls
              muted={true}
              playing={true}
            />
          </div>
          <div className="flex justify-between px-2">
            {sessionData?.user.role === "admin" ? (
              <div>
                <Button
                  onClick={() => handleDeleteWord()}
                  className="mr-2 dark:bg-red-800 dark:text-white"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Xóa"}
                </Button>
              </div>
            ) : (
              <div></div>
            )}
            <Button
              onClick={() => props._setIsOpen(false)}
              className="dark:bg-neutral-800 dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Đóng
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
