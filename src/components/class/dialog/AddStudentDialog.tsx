import React, { useState } from "react";
import { Loader2, Loader2Icon, PlusIcon } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type PrivateProps = {
  isOpen: boolean;
  classroomId: string;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _refetch: (...args: any[]) => any;
};

export default function AddStudentDialog(props: PrivateProps) {
  const [searchInput, setSearchInput] = useState("");
  const [studentAdding, setStudentAdding] = useState([""]);

  const { data: sessionData } = useSession();

  const { data: studentListData, refetch } =
    api.user.findAllStudents.useQuery();

  const { mutateAsync: addStudent, isLoading: isAddLoading } =
    api.classroom.addStudentToClass.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const renderStudentList = studentListData?.map((student) => {
    return (
      <div
        key={student.id}
        className="
          flex 
          items-center 
          justify-between 
          rounded-lg border-[1px] 
          border-solid 
        border-neutral-800 
          p-4 
        dark:bg-neutral-900"
      >
        <div className="flex gap-4">
          <Avatar className="h-[48px] w-[48px] hover:cursor-pointer">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={student.image ?? ""}
            />
            <AvatarFallback>{student.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-100">{student.name}</div>
            <div className="text-neutral-400">{student.email}</div>
          </div>
        </div>
        <div>
          <Button
            disabled={
              isAddLoading &&
              (studentAdding.find((id) => id === student.id) ? true : false)
            }
            size={"icon"}
            onClick={() => handleAddStudent(student.id)}
          >
            {isAddLoading &&
            (studentAdding.find((id) => id === student.id) ? true : false) ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
          </Button>
        </div>
      </div>
    );
  });

  const handleAddStudent = async (studentId: string) => {
    const AddedStudentQueue = [...studentAdding, studentId];
    setStudentAdding(AddedStudentQueue);
    await addStudent({
      studentId,
      classroomId: props.classroomId,
    });
    const removedStudentQueue = studentAdding.filter((id) => id === studentId);
    setStudentAdding(removedStudentQueue);
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
        <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>Danh sách học sinh</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-4 p-5 pr-0 pt-3 ">
            <div className="grid items-center">
              <div>
                <Input
                  className="mb-3 w-[97%]"
                  type="text"
                  placeholder="Tìm kiếm..."
                />
              </div>

              <div className="flex max-h-[600px] flex-col gap-2 overflow-y-scroll">
                <div className="flex flex-col gap-2">{renderStudentList}</div>
              </div>
              <div className="mr-4 mt-3 flex justify-end gap-2">
                <Button
                  onClick={() => props._setIsOpen(false)}
                  className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
