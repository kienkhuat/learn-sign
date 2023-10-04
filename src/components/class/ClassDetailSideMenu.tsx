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
import { useRouter } from "next/router";
import React, { useState } from "react";

type PrivateProps = {
  pathname: string;
};

const CLASS_DATA = {
  id: "1",
  name: "Lớp dạy ký hiệu 1",
  teacher: {
    name: "Giảng viên 1",
  },
};

export default function ClassDetailSideMenu(props: PrivateProps) {
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div className="flex dark:bg-neutral-800 ">
      <div className="h-[100%] w-[284px] p-5">
        <div className="flex h-[100%] flex-col justify-between rounded-3xl shadow-md dark:bg-neutral-900  dark:text-neutral-300 dark:shadow-neutral-950">
          <div>
            <div className="mb-10 mt-10 flex flex-col items-center gap-3">
              <div className="text-2xl font-bold">{CLASS_DATA.name}</div>
              <div className="text-neutral-400">{CLASS_DATA.teacher.name}</div>
            </div>
            <Link
              href={{
                pathname: "/class/[classId]/",
                query: { classId: CLASS_DATA.id },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  props.pathname === `/class/[classId]`
                    ? "bg-neutral-800 font-bold"
                    : ""
                }`}
              >
                <FileTextIcon />
                <div>Tài liệu</div>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/class/[classId]/students",
                query: { classId: CLASS_DATA.id },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  props.pathname === "/class/[classId]/students"
                    ? "bg-neutral-800 font-bold"
                    : ""
                }`}
              >
                <UsersIcon />
                <div>Danh Sách Học Sinh</div>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/class/[classId]/assignments",
                query: { classId: CLASS_DATA.id },
              }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  props.pathname === "/class/[classId]/assignments"
                    ? "bg-neutral-800 font-bold"
                    : ""
                }`}
              >
                <PenSquareIcon />
                <div>Bài tập</div>
              </div>
            </Link>
            <div>
              <Link href="/class/dashboard" className="flex flex-col px-4 py-1">
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
