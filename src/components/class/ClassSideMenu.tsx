import {
  BookOpenIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  ShapesIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type PrivateProps = {
  pathname: string;
};

export default function ClassSideMenu(props: PrivateProps) {
  const [selectedMenu, setSelectedMenu] = useState("");
  return (
    <div className="flex dark:bg-neutral-800 ">
      <div className="h-[100%] w-[284px] p-5">
        <div className="flex h-[100%] flex-col rounded-3xl shadow-md dark:bg-neutral-900 dark:text-neutral-300  dark:shadow-neutral-950">
          <div className="mb-10 mt-10 flex flex-col items-center">
            <BookOpenIcon size={"60px"} />
            <div className="text-2xl">Learn Sign</div>
          </div>
          <Link href="/class/dashboard" className="flex flex-col px-4 py-1">
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                props.pathname === "/class/dashboard"
                  ? "bg-neutral-800 font-bold"
                  : ""
              }`}
            >
              <LayoutDashboardIcon />
              <div>Dashboard</div>
            </div>
          </Link>
          <Link href="/class" className="flex flex-col px-4 py-1">
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                props.pathname === "/class" ? "bg-neutral-800 font-bold" : ""
              }`}
            >
              <GraduationCapIcon />
              <div>Lớp học</div>
            </div>
          </Link>
          <Link href="/class/students" className="flex flex-col px-4 py-1">
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                props.pathname === "/class/students"
                  ? "bg-neutral-800 font-bold"
                  : ""
              }`}
            >
              <UsersIcon />
              <div>Học Sinh</div>
            </div>
          </Link>
          <div className="flex flex-col px-4 py-1">
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                props.pathname === "/class/chat"
                  ? "bg-neutral-800 font-bold"
                  : ""
              }`}
            >
              <MessageCircleIcon />
              <div>Trao đổi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
