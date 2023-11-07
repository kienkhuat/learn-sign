import { useSession } from "next-auth/react";
import React from "react";
import ClassSideMenu from "../ClassSideMenu";
import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";

export default function ClassStudentScreen() {
  const { data: sessionData } = useSession();

  const {
    data: userList,
    isLoading,
    refetch,
  } = api.user.findAllUser.useQuery();

  const renderUserList = userList?.map((user) => {
    return (
      <Link
        href={`user/${user.id}`}
        key={user.id}
        className="flex h-full flex-col justify-between overflow-hidden rounded-lg p-4 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-neutral-950"
      >
        <div className="mb-4 flex items-center gap-4">
          <Avatar className="h-[48px] w-[48px] hover:cursor-pointer">
            <AvatarImage referrerPolicy="no-referrer" src={user.image ?? ""} />
            <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-lg text-neutral-100">{user.name}</div>
            <div className="text-neutral-400">{user.email}</div>
            <div className="text-neutral-400">Role: {user.role}</div>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <>
      {sessionData ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassSideMenu />
          <div className="flex w-full flex-col gap-4 py-5 pr-6 pt-8">
            <div className="text-3xl font-bold text-neutral-300">
              Danh sách người dùng
            </div>
            <div className="3xl:grid-cols-5 grid grid-cols-4 gap-3">
              {renderUserList}
            </div>
          </div>
        </div>
      ) : (
        <div>Need to login</div>
      )}
    </>
  );
}
