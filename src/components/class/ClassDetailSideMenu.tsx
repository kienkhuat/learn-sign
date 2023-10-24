import {
  ArrowLeftFromLineIcon,
  BookOpenIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  PenSquareIcon,
  ShapesIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { classroomDataType } from "~/types/types";

type PrivateProps = {
  classroomData: classroomDataType;
};

export default function ClassDetailSideMenu(props: PrivateProps) {
  const [selectedMenu, setSelectedMenu] = useState("");

  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");

  return (
    <div className="flex dark:bg-neutral-800 ">
      <div className="h-[100%] w-[284px] p-5">
        <div className="flex h-[100%] flex-col justify-between rounded-3xl shadow-md dark:bg-neutral-900  dark:text-neutral-300 dark:shadow-neutral-950">
          <div>
            <div className="mb-10 mt-10 flex flex-col items-center gap-3">
              <div className="text-2xl font-bold">
                {props.classroomData?.name}
              </div>
              <div className="text-neutral-400">
                {props.classroomData?.teacher?.name}
              </div>
            </div>
            <Link
              href={{
                pathname: "/class/[classId]",
                query: { classId: props.classroomData?.id, tab: "resources" },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  tabParams === `resources` ? "bg-neutral-800 font-bold" : ""
                }`}
              >
                <FileTextIcon />
                <div>Tài liệu</div>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/class/[classId]",
                query: { classId: props.classroomData?.id, tab: "students" },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  tabParams === "students" ? "bg-neutral-800 font-bold" : ""
                }`}
              >
                <UsersIcon />
                <div>Danh Sách Học Sinh</div>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/class/[classId]",
                query: { classId: props.classroomData?.id, tab: "assignments" },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  tabParams === "assignments" ? "bg-neutral-800 font-bold" : ""
                }`}
              >
                <PenSquareIcon />
                <div>Bài tập</div>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/class/[classId]",
                query: { classId: props.classroomData?.id, tab: "chatroom" },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  tabParams === "chatroom" ? "bg-neutral-800 font-bold" : ""
                }`}
              >
                <MessageCircleIcon />
                <div>Trao đổi</div>
              </div>
            </Link>
            <div>
              <Link href="/class" className="flex flex-col px-4 py-1">
                <div className={`flex cursor-pointer gap-3 rounded-lg p-3 `}>
                  <ArrowLeftFromLineIcon />
                  <div>Quay về</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
