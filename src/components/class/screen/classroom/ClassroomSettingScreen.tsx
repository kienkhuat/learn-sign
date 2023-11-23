import React, { useState } from "react";
import { classroomDataType } from "~/types/types";
import { api } from "~/utils/api";
import ClassDetailSideMenu from "../../ClassDetailSideMenu";
import { Loader2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { Input } from "~/components/ui/input";

type PrivateProps = {
  classroomData: classroomDataType;
  _refetch: (...args: any[]) => any;
  isLoading: boolean;
};

export default function ClassroomSettingScreen(props: PrivateProps) {
  const [isEditingClassName, setIsEditingClassName] = useState<boolean>(false);
  const [editedClassName, setEditedClassName] = useState<string>();

  const { data: sessionData } = useSession();

  const { mutateAsync: editClassName, isLoading: isEditingClassNameLoading } =
    api.classroom.editClassName.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const { mutateAsync: deleteClassroom, isLoading: isDeletingClassroom } =
    api.classroom.deleteClassroom.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const handleEditClassName = async () => {
    if (sessionData?.user.id !== props.classroomData.teacherId) return;
    if (!editedClassName) return;
    await editClassName({
      classroomId: props.classroomData.id,
      newClassName: editedClassName,
    });
    setEditedClassName(undefined);
    setIsEditingClassName(false);
  };

  const handleDeleteClassroom = async () => {
    if (sessionData?.user.id !== props.classroomData.teacherId) return;
    await deleteClassroom({
      classroomId: props.classroomData.id,
    });
  };

  return (
    <>
      {!props.isLoading ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassDetailSideMenu classroomData={props.classroomData!} />
          <div className="w-full py-5 pr-6 pt-8">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-3xl font-bold text-neutral-300">
                Cài đặt lớp học
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="font-bold">Tên lớp:</div>
                <div>{props.classroomData.name}</div>
                {sessionData?.user.id === props.classroomData.teacherId ? (
                  <div>
                    {isEditingClassName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Nhập tên lớp sẽ sửa..."
                          onChange={(e) =>
                            setEditedClassName(e.currentTarget.value)
                          }
                        />
                        <Button
                          disabled={isEditingClassNameLoading}
                          size="sm"
                          onClick={() => handleEditClassName()}
                        >
                          {isEditingClassNameLoading ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            "Lưu"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsEditingClassName(false)}
                          className="dark:bg-neutral-950 dark:text-neutral-300"
                          disabled={isEditingClassNameLoading}
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsEditingClassName(true)}
                        disabled={isDeletingClassroom}
                      >
                        Sửa
                      </Button>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Xóa lớp học</div>
                <Button
                  size={"sm"}
                  className="dark:bg-red-800 dark:text-white hover:dark:text-neutral-950"
                  onClick={() => handleDeleteClassroom()}
                  disabled={isDeletingClassroom}
                >
                  {isDeletingClassroom ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Xóa"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </>
  );
}
