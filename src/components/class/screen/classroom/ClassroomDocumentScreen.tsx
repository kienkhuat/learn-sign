import React from "react";
import ClassDetailSideMenu from "../../ClassDetailSideMenu";
import { Loader2Icon } from "lucide-react";
import ClassroomStudentList from "../../list/classroom/ClassroomStudentList";
import { classroomDataType } from "~/types/types";

type PrivateProps = {
  classroomData: classroomDataType;
  _refetch: (...args: any[]) => any;
  isLoading: boolean;
};

export default function ClassroomDocumentScreen(props: PrivateProps) {
  return (
    <>
      {!props.isLoading ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassDetailSideMenu classroomData={props.classroomData!} />
          {/* Show documents here */}
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </>
  );
}
