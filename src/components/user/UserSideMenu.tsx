import {
  ArrowLeftFromLineIcon,
  BookOpenIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  PenSquareIcon,
  ShapesIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { classroomDataType } from "~/types/types";

type PrivateProps = {
  userData: classroomDataType;
};

export default function UserSideMenu(props: PrivateProps) {
  const [selectedMenu, setSelectedMenu] = useState("");

  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");

  return (
    <div className="flex dark:bg-neutral-800 ">
      <div className="h-[100%] w-[284px] p-5">
        <div className="flex h-[100%] flex-col justify-between rounded-3xl shadow-md dark:bg-neutral-900  dark:text-neutral-300 dark:shadow-neutral-950">
          <div className="mt-10">
            <div
              // href={{
              //   pathname: "/class/[classId]",
              //   query: { userId: props.userData?.id, tab: "userInfo" },
              // }}
              className="flex flex-col px-4 py-1"
            >
              <div
                className={`flex cursor-pointer gap-3 rounded-lg p-3 ${
                  !(tabParams === `userInfo`) ? "bg-neutral-800 font-bold" : ""
                }`}
              >
                <UserIcon />
                <div>Thông tin</div>
              </div>
            </div>
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
