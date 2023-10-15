import { useSession } from "next-auth/react";
import React from "react";
import TeacherClassList from "../list/TeacherClassList";
import StudentClassList from "../list/StudentClassList";
import ClassSideMenu from "../ClassSideMenu";

export default function ClassListScreen() {
  const { data: sessionData } = useSession();

  const renderRoleClassList = () => {
    switch (sessionData?.user.role) {
      case "teacher":
        return <TeacherClassList />;
      case "student":
        return <StudentClassList />;
      case "admin":
        return <TeacherClassList />;
    }
  };

  return (
    <>
      {sessionData ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassSideMenu />
          {renderRoleClassList()}
        </div>
      ) : (
        <div>Need to login</div>
      )}
    </>
  );
}
