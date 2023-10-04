import React, { useState } from "react";
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
import { Textarea } from "../ui/textarea";
import { api } from "~/utils/api";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _refetch: (...args: any[]) => any;
};
export default function AddWordDialog(props: PrivateProps) {
  const [word, setWord] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [definition, setDefinition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: apiCreateWord } =
    api.dictionary.createNewWord.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const handleCreateWord = async () => {
    setIsLoading(true);
    const createWordData = {
      word,
      videoLink,
      thumbnailLink,
      definition,
    };
    console.log(createWordData);
    await apiCreateWord({
      ...createWordData,
    });
    setIsLoading(false);
    props._setIsOpen(false);
    setVideoLink("");
    setWord("");
    setThumbnailLink("");
    setDefinition("");
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
        <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>Thêm từ</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex max-h-[600px] flex-col gap-4 overflow-y-scroll p-5 pr-0 pt-3">
            <div className="grid w-[95%]  items-center gap-2.5">
              <Label htmlFor="text">Từ</Label>
              <Input
                onChange={(e) => setWord(e.currentTarget.value)}
                type="text"
                placeholder="Nhập từ..."
                required
              />
            </div>
            <div className="grid w-[95%]  items-center gap-2.5">
              <Label htmlFor="text">Link video</Label>
              <Input
                onChange={(e) => setVideoLink(e.currentTarget.value)}
                type="text"
                placeholder="Nhập link video..."
              />
            </div>
            <div className="grid w-[95%]  items-center gap-2.5">
              <Label htmlFor="text">Link Thumbnail</Label>
              <Input
                onChange={(e) => setThumbnailLink(e.currentTarget.value)}
                type="text"
                placeholder="Nhập link thumbnail..."
              />
            </div>
            <div className="grid w-[95%]  items-center gap-2.5">
              <Label htmlFor="text">Định nghĩa</Label>
              <Textarea
                onChange={(e) => setDefinition(e.currentTarget.value)}
                placeholder="Nhập định nghĩa..."
                required
              />
            </div>
            <div className="mr-1 flex justify-end gap-2">
              <Button
                disabled={isLoading ? true : false}
                onClick={() => props._setIsOpen(false)}
                className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
              >
                Đóng
              </Button>
              <Button onClick={() => handleCreateWord()}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Thêm"}
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
