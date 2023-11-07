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
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

type PrivateProps = {
  // pathname: string;
};

export default function ClassSideMenu(props: PrivateProps) {
  const [selectedMenu, setSelectedMenu] = useState("");

  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");

  const { data: sessionData } = useSession();

  return (
    <div className="flex dark:bg-neutral-800 ">
      <div className="h-[100%] w-[284px] p-5">
        <div className="flex h-[100%] flex-col rounded-3xl shadow-md dark:bg-neutral-900 dark:text-neutral-300  dark:shadow-neutral-950">
          <div className="mb-10 mt-10 flex flex-col items-center">
            <BookOpenIcon size={"60px"} />
            <div className="text-2xl">Learn Sign</div>
          </div>
          <Link href="/class?tab=dashboard" className="flex flex-col px-4 py-1">
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                tabParams === "dashboard" ? "bg-neutral-800 font-bold" : ""
              }`}
            >
              <LayoutDashboardIcon />
              <div>Dashboard</div>
            </div>
          </Link>
          <Link
            href="/class?tab=classrooms"
            className="flex flex-col px-4 py-1"
          >
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                tabParams === "classrooms" ? "bg-neutral-800 font-bold" : ""
              }`}
            >
              <GraduationCapIcon />
              <div>Lớp học</div>
            </div>
          </Link>
          {sessionData?.user.role === "admin" ? (
            <Link href="/class?tab=user" className="flex flex-col px-4 py-1">
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  tabParams === "user" ? "bg-neutral-800 font-bold" : ""
                }`}
              >
                <UsersIcon />
                <div>Người dùng</div>
              </div>
            </Link>
          ) : (
            <></>
          )}
          {/* <Link href="/class?tab=chat" className="flex flex-col px-4 py-1">
            <div
              className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                tabParams === "chat" ? "bg-neutral-800 font-bold" : ""
              }`}
            >
              <MessageCircleIcon />
              <div>Trao đổi</div>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
