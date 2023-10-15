import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import AddStudentDialog from "../../dialog/AddStudentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";

type PrivateProps = {
  classroomData: {
    students: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: string;
    }[];
    teacher: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: string;
    };
  } & {
    name: string;
    id: string;
    createdAt: Date;
    coverImage: string;
  };
  _refetch: (...args: any[]) => any;
};

export default function ClassroomStudentList(props: PrivateProps) {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  const { mutateAsync: removeStudent, isLoading } =
    api.classroom.removeStudentFromClass.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const renderStudentList = props.classroomData.students.map((student) => {
    return (
      <div className="rounded-lg p-4 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-neutral-950">
        <div className="mb-4 flex items-center gap-4">
          <Avatar className="h-[48px] w-[48px] hover:cursor-pointer">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={student.image ?? ""}
            />
            <AvatarFallback>{student.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-lg text-neutral-100">{student.name}</div>
            <div className="text-neutral-400">{student.email}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div></div>
          <Button
            size={"sm"}
            className="dark:bg-red-800 dark:text-white hover:dark:bg-red-950"
            onClick={() => handleRemoveStudent(student.id)}
          >
            Xóa
          </Button>
        </div>
      </div>
    );
  });

  const handleRemoveStudent = (studentId: string) => {
    removeStudent({
      classroomId: props.classroomData.id,
      studentId: studentId,
    });
  };

  return (
    <>
      <div className="w-full py-5 pr-6 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-3xl font-bold text-neutral-300">
            Danh sách học sinh
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-[400px] text-neutral-300"
            />
            <Button onClick={() => setIsAddStudentDialogOpen(true)}>
              Thêm
            </Button>
          </div>
        </div>
        <div className="grid items-center gap-4 lg:grid-cols-4 2xl:grid-cols-4">
          {renderStudentList}
        </div>
      </div>
      <AddStudentDialog
        classroomId={props.classroomData.id}
        isOpen={isAddStudentDialogOpen}
        _setIsOpen={setIsAddStudentDialogOpen}
      />
    </>
  );
}