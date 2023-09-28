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
import { PlusIcon } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ReactPlayer from "react-player";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // word: string;
  // wordDescription: string;
  // videoLink: string;
};

const DUMMY_WORD = {
  word: "Địa chỉ",
  wordDescription:
    "Những thông tin cụ thể về chỗ ở, nơi làm việc của một người, một cơ quan, v.v.",
  videoLink: "https://qipedc.moet.gov.vn/videos/D0001N.mp4?autoplay=true",
};

export default function WordDetailDialog(props: PrivateProps) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
      <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white sm:min-w-[800px]">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="text-3xl">{DUMMY_WORD.word}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex max-h-[600px] flex-col gap-4 overflow-y-scroll p-5 pr-0 pt-3">
          <div className="mb-4 text-xl">{DUMMY_WORD.wordDescription}</div>
          <ReactPlayer
            width="100%"
            height="100%"
            url="https://qipedc.moet.gov.vn/videos/D0001N.mp4?autoplay=true"
            controls
          />
          <div className="flex justify-end">
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
