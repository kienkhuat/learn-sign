import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import CreateAssignmentDialog from "../../dialog/CreateAssignmentDialog";
import {
  assignmentDataListType,
  assignmentDataType,
  classroomDataType,
} from "~/types/types";
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  format,
  formatDistance,
  intervalToDuration,
} from "date-fns";
import ClassroomAssignmentCard from "../../card/ClassroomAssignmentCard";
import AssignmentDetailDialog from "../../dialog/AssignmentDetailDialog";
import { Loader2Icon } from "lucide-react";

type PrivateProps = {
  classroomData: classroomDataType;
  _refetchClassroomData: (...args: any[]) => any;
  isClassroomDataLoading: boolean;

  assignmentDataList: assignmentDataListType;
  isAssignmentDataListLoading: boolean;
  _refetchAssignmentListData: (...args: any[]) => any;

  _setAssignmentSearchInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export default function ClassroomAssignmentList(props: PrivateProps) {
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    useState(false);
  const [isDetailAssignmentOpen, setIsDetailAssignmentOpen] =
    useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<assignmentDataType>();

  const [searchInputValue, setSearchInputValue] = useState<string>();

  const { data: sessionData } = useSession();

  const assignments = props.assignmentDataList?.map((assignment, index) => {
    return (
      <ClassroomAssignmentCard
        key={assignment.id}
        assignment={assignment}
        classroomData={props.classroomData}
        _setIsDetailAssignmentOpen={setIsDetailAssignmentOpen}
        _setSelectedAssignment={setSelectedAssignment}
      />
    );
  });

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props._setAssignmentSearchInput(searchInputValue);
    }
  };

  return (
    <>
      <div className="w-full overflow-y-scroll py-5 pr-6 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-3xl font-bold text-neutral-300">
            Danh sách bài tập
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-[400px] text-neutral-300"
              onChange={(e) => setSearchInputValue(e.currentTarget.value)}
              onKeyDown={(e) => handleSearch(e)}
            />
            {sessionData?.user.id === props.classroomData.teacher.id ? (
              <Button onClick={() => setIsCreateAssignmentDialogOpen(true)}>
                Tạo
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div>
          {props.isAssignmentDataListLoading ? (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <div className="grid items-center gap-4 lg:grid-cols-4">
              {!props.isAssignmentDataListLoading &&
              props.assignmentDataList?.length ? (
                assignments
              ) : (
                <div>Không có bài tập nào</div>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateAssignmentDialog
        _refetch={props._refetchAssignmentListData}
        _setIsOpen={setIsCreateAssignmentDialogOpen}
        isOpen={isCreateAssignmentDialogOpen}
        classroomData={props.classroomData}
        isLoading={props.isClassroomDataLoading}
      />
      {selectedAssignment && (
        <AssignmentDetailDialog
          isOpen={isDetailAssignmentOpen}
          _setIsOpen={setIsDetailAssignmentOpen}
          _refetchAssignment={props._refetchAssignmentListData}
          assignment={selectedAssignment}
          classroomData={props.classroomData}
        />
      )}
    </>
  );
}
