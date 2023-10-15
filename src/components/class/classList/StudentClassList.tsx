import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
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
    coverImage: base64Images[0],
    name: "Lớp dạy ký hiệu 4",
    teacher: "Giảng viên 4",
  },
  {
    id: "5",
    coverImage: base64Images[3],
    name: "Lớp dạy ký hiệu 5",
    teacher: "Giảng viên 5",
  },
];
const CLASS_DATA2 = [
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
    coverImage: base64Images[0],
    name: "Lớp dạy ký hiệu 4",
    teacher: "Giảng viên 4",
  },
  {
    id: "5",
    coverImage: base64Images[3],
    name: "Lớp dạy ký hiệu 5",
    teacher: "Giảng viên 5",
  },
  {
    id: "6",
    coverImage: base64Images[2],
    name: "Lớp dạy ký hiệu 6",
    teacher: "Giảng viên 6",
  },
  {
    id: "7",
    coverImage: base64Images[0],
    name: "Lớp dạy ký hiệu 7",
    teacher: "Giảng viên 7",
  },
  {
    id: "8",
    coverImage: base64Images[1],
    name: "Lớp dạy ký hiệu 8",
    teacher: "Giảng viên 8",
  },
  {
    id: "9",
    coverImage: base64Images[2],
    name: "Lớp dạy ký hiệu 9",
    teacher: "Giảng viên 9",
  },
  {
    id: "10",
    coverImage: base64Images[0],
    name: "Lớp dạy ký hiệu 10",
    teacher: "Giảng viên 10",
  },
  {
    id: "11",
    coverImage: base64Images[1],
    name: "Lớp dạy ký hiệu 11",
    teacher: "Giảng viên 11",
  },
];

export default function StudentClassList() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex w-full flex-col gap-10 overflow-auto px-2 py-5 pr-6">
      <div className="flex flex-col gap-4 dark:text-neutral-300">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">Lớp học của bạn:</div>
          {/* <Input type="text" placeholder="Tìm kiếm..." className="w-[400px]" /> */}
        </div>
        {/* <ClassListView classListData={CLASS_DATA} /> */}
      </div>
      <div className="flex flex-col gap-4 dark:text-neutral-300">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">Tất cả các lớp:</div>
          <Input type="text" placeholder="Tìm kiếm..." className="w-[400px]" />
        </div>
        {/* <ClassListView classListData={CLASS_DATA2} /> */}
      </div>
    </div>
  );
}
