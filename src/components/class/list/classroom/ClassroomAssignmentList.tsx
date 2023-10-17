import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import CreateAssignmentDialog from "../../dialog/CreateAssignmentDialog";
import { classroomDataType } from "~/types/types";

type PrivateProps = {
  classroomData: classroomDataType;
  _refetch: (...args: any[]) => any;
  isLoading: boolean;
};

export default function ClassroomAssignmentList(props: PrivateProps) {
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    useState(false);
  const { data: sessionData } = useSession();

  const renderAssignmentList = () => {
    const assignments = props.classroomData.assignments.map(
      (assignment, index) => {
        return (
          <div
            key={assignment.id}
            className="rounded-lg p-2 shadow-md dark:bg-neutral-900 dark:shadow-neutral-950"
          >
            <div>{assignment.name}</div>
          </div>
        );
      },
    );
    return (
      <div className="grid items-center gap-2 lg:grid-cols-4">
        {assignments}
      </div>
    );
  };

  return (
    <>
      <div className="w-full py-5 pr-6 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-3xl font-bold text-neutral-300">
            Danh sách bài tập
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-[400px] text-neutral-300"
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
        {renderAssignmentList()}
      </div>
      <CreateAssignmentDialog
        _refetch={() => {}}
        _setIsOpen={setIsCreateAssignmentDialogOpen}
        isOpen={isCreateAssignmentDialogOpen}
        classroomData={props.classroomData}
        isLoading={props.isLoading}
      />
    </>
  );
}
