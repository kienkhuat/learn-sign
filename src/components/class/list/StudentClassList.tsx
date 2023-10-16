import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import ClassListView from "./ClassListView";
import { base64Images } from "~/assets/base64Images";

export default function StudentClassList() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex w-full flex-col gap-10 overflow-auto px-2 py-5 pr-6 pt-8">
      <div className="flex flex-col gap-4 dark:text-neutral-300">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">Lớp học của bạn:</div>
          <Input type="text" placeholder="Tìm kiếm..." className="w-[400px]" />
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
