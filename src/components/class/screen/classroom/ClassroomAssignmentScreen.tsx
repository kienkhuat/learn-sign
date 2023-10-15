import React from "react";
import ClassDetailSideMenu from "../../ClassDetailSideMenu";
import { Loader2Icon } from "lucide-react";
import ClassroomStudentList from "../../list/classroom/ClassroomStudentList";
type PrivateProps = {
  classroomData: {
    students: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: string;
    }[];
    teacher: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: string;
    };
  } & {
    name: string;
    id: string;
    createdAt: Date;
    coverImage: string;
  };
  _refetch: (...args: any[]) => any;
};

export default function ClassroomAssignmentScreen(props: PrivateProps) {
  return (
    <>
      {props.classroomData ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassDetailSideMenu classroomData={props.classroomData!} />
          {/* Show Assignments here */}
        </div>
      ) : (
        <div>
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </>
  );
}
