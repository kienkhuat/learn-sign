import { useSession } from "next-auth/react";
import React from "react";
import TeacherClassList from "../list/TeacherClassList";
import StudentClassList from "../list/StudentClassList";
import ClassSideMenu from "../ClassSideMenu";

export default function ClassStudentScreen() {
  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassSideMenu />
        </div>
      ) : (
        <div>Need to login</div>
      )}
    </>
  );
}
