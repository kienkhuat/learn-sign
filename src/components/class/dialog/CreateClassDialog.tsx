import React, { useState } from "react";
import { Loader2, PlusIcon } from "lucide-react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { base64Images } from "~/assets/base64Images";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _refetch: (...args: any[]) => any;
};

export default function CreateClassDialog(props: PrivateProps) {
  const [className, setClassName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: sessionData } = useSession();

  const { mutateAsync: apiCreateClassroom } =
    api.classroom.createClassroom.useMutation({
      // onSuccess(data, variables, context) {
      //   return props._refetch();
      // },
    });

  const handleCreateClass = async () => {
    if (!sessionData) return false;
    setIsLoading(true);
    const createClassData = {
      name: className,
      teacherId: sessionData.user.id,
      //TODO: Store image somewhere else and not base64
      coverImage:
        base64Images[Math.floor(Math.random() * base64Images.length)] || "",
    };
    console.log(createClassData);
    await apiCreateClassroom({
      ...createClassData,
    });
    setIsLoading(false);
    props._setIsOpen(false);
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
        <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>Tạo Lớp</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex max-h-[600px] flex-col gap-4 overflow-y-scroll p-5 pr-0 pt-3">
            <div className="grid w-[99%]  items-center gap-2.5">
              <Label htmlFor="text">Tên Lớp:</Label>
              <Input
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setClassName(e.currentTarget.value)
                }
                type="text"
                placeholder="Nhập tên lớp..."
                required
              />
              <div className="mr-1 flex justify-end gap-2">
                <Button
                  disabled={isLoading ? true : false}
                  onClick={() => props._setIsOpen(false)}
                  className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
                >
                  Đóng
                </Button>
                <Button onClick={() => handleCreateClass()}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Tạo"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
