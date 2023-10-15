import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

type PrivateProps = {
  classListData: ({
    teacher: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: string;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    teacherId: string;
    coverImage: string;
  })[];
};

export default function ClassListView(props: PrivateProps) {
  const { data: sessionData } = useSession();
  const classToRender = props.classListData?.map((classData, index) => {
    return (
      <Link
        key={index}
        href={`/class/${classData.id}`}
        className="flex h-[200px] w-[100%] cursor-pointer flex-col gap-2 rounded-lg shadow-md shadow-neutral-950 dark:bg-neutral-900 dark:text-neutral-300"
      >
        <div className="h-[132px] w-[100%] overflow-hidden rounded-t-lg">
          <img
            src={classData.coverImage}
            alt="Class cover image"
            className="flex h-[100%] w-[100%] justify-center object-cover transition-all duration-500 hover:scale-110"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="font-bold">{classData.name}</div>
          <div className="text-sm text-neutral-400">
            {classData.teacher?.name}
          </div>
        </div>
      </Link>
    );
  });
  return (
    <div className="grid items-center gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {classToRender}
    </div>
  );
}
