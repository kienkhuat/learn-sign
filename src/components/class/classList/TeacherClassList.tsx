import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import CreateClassDialog from "../dialog/CreateClassDialog";
import ClassListView from "./ClassListView";
import { base64Images } from "~/assets/base64Images";

const CLASS_DATA = [
  {
    id: "1",
    coverImage: base64Images[0],
    name: "Lớp dạy ký hiệu 1",
    teacher: "Giảng viên 1",
  },
  {
    id: "2",
    coverImage: base64Images[1],
    name: "Lớp dạy ký hiệu 2",
    teacher: "Giảng viên 2",
  },
  {
    id: "3",
    coverImage: base64Images[2],
    name: "Lớp dạy ký hiệu 3",
    teacher: "Giảng viên 3",
  },
  {
    id: "4",
    coverImage: base64Images[3],
    name: "Lớp dạy ký hiệu 4",
    teacher: "Giảng viên 4",
  },
  {
    id: "5",
    coverImage: base64Images[4],
    name: "Lớp dạy ký hiệu 5",
    teacher: "Giảng viên 5",
  },
];

export default function TeacherClassList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: sessionData } = useSession();

  return (
    <>
      <div className="flex w-full flex-col gap-10 overflow-auto px-2 py-5 pr-6">
        <div className="flex flex-col gap-4 dark:text-neutral-300">
          <div className="flex justify-between">
            <div className="text-3xl font-bold">Lớp học của bạn:</div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-[400px]"
              />
              <Button onClick={() => setIsDialogOpen(true)}>Tạo Lớp</Button>
            </div>
          </div>
          <ClassListView classListData={CLASS_DATA} />
        </div>
      </div>
      <CreateClassDialog
        isOpen={isDialogOpen}
        _setIsOpen={setIsDialogOpen}
        _refetch={() => {}}
      />
    </>
  );
}
