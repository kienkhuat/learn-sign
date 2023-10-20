import React, { useState } from "react";
import ClassDetailSideMenu from "../../ClassDetailSideMenu";
import { Loader2Icon } from "lucide-react";
import ClassroomStudentList from "../../list/classroom/ClassroomStudentList";
import ClassroomAssignmentList from "../../list/classroom/ClassroomAssignmentList";
import { classroomDataType } from "~/types/types";
import { api } from "~/utils/api";
type PrivateProps = {
  classroomData: classroomDataType;
  _refetchClassroomData: (...args: any[]) => any;
  isClassroomDataLoading: boolean;
};

export default function ClassroomAssignmentScreen(props: PrivateProps) {
  const [assignmentSearchInput, setAssignmentSearchInput] = useState<string>();

  const {
    data: assignmentDataList,
    isLoading: isAssignmentDataListLoading,
    refetch: refetchAssignmentDataList,
  } = api.assignment.findClassroomAssignments.useQuery({
    classroomId: props.classroomData?.id || "",
    searchInput: assignmentSearchInput ?? "",
  });

  return (
    <>
      {!props.isClassroomDataLoading ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassDetailSideMenu classroomData={props.classroomData!} />
          <ClassroomAssignmentList
            classroomData={props.classroomData}
            _refetchClassroomData={props._refetchClassroomData}
            isClassroomDataLoading={props.isClassroomDataLoading}
            assignmentDataList={assignmentDataList}
            isAssignmentDataListLoading={isAssignmentDataListLoading}
            _refetchAssignmentListData={refetchAssignmentDataList}
            _setAssignmentSearchInput={setAssignmentSearchInput}
          />
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </>
  );
}
