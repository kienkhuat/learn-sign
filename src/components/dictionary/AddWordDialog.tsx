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
import { Textarea } from "../ui/textarea";
type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function AddWordDialog(props: PrivateProps) {
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
              <Input type="text" placeholder="Nhập từ..." />
            </div>
            <div className="grid w-[95%]  items-center gap-2.5">
              <Label htmlFor="text">Link video</Label>
              <Input type="text" placeholder="Nhập link video..." />
            </div>
            <div className="grid w-[95%]  items-center gap-2.5">
              <Label htmlFor="text">Định nghĩa</Label>
              <Textarea placeholder="Nhập định nghĩa..." />
            </div>
            <div className="mr-1 flex justify-end gap-2">
              <Button
                onClick={() => props._setIsOpen(false)}
                className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
              >
                Đóng
              </Button>
              <Button>Thêm</Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
