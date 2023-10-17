import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import CreateAssignmentDialog from "../../dialog/CreateAssignmentDialog";

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
  isLoading: boolean;
};

export default function ClassroomAssignmentList(props: PrivateProps) {
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    useState(false);
  const { data: sessionData } = useSession();

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
          {/* here */}
        </div>
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
