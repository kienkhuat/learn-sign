import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import ClassListView from "./ClassListView";
import { base64Images } from "~/assets/base64Images";
import { api } from "~/utils/api";
import { Loader2Icon } from "lucide-react";

export default function StudentClassList() {
  const [studentClassroomSearchInput, setStudentClassroomSearchInput] =
    useState("");
  const [studentClassroomSearchValue, setStudentClassroomSearchValue] =
    useState("");
  const [allClassroomSearchInput, setAllClassroomSearchInput] = useState("");
  const [allClassroomSearchValue, setAllClassroomSearchValue] = useState("");

  const { data: sessionData } = useSession();
  if (!sessionData) return;

  const {
    data: studentClassroomData,
    isLoading: isStudentClassroomLoading,
    refetch: refetchStudentClassroom,
  } = api.classroom.findStudentClassrooms.useQuery({
    searchInput: studentClassroomSearchInput,
    userId: sessionData.user.id,
  });

  const {
    data: allClassroomData,
    isLoading: isAllClassroomLoading,
    refetch: refetchAllClassroom,
  } = api.classroom.findAllClassrooms.useQuery({
    searchInput: allClassroomSearchInput,
  });

  const handleSearchStudentClassroom = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      setStudentClassroomSearchInput(studentClassroomSearchValue);
    }
  };
  const handleSearchAllClassroom = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      setAllClassroomSearchInput(allClassroomSearchValue);
    }
  };

  return (
    <div className="flex w-full flex-col gap-10 overflow-auto px-2 py-5 pr-6 pt-8">
      <div className="flex flex-col gap-4 dark:text-neutral-300">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">Lớp học của bạn:</div>
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-[400px]"
            onChange={(e) =>
              setStudentClassroomSearchValue(e.currentTarget.value)
            }
            onKeyDown={(e) => handleSearchStudentClassroom(e)}
          />
        </div>
        {!isStudentClassroomLoading ? (
          studentClassroomData && studentClassroomData.length > 0 ? (
            <ClassListView classListData={studentClassroomData} />
          ) : (
            <div>
              {studentClassroomSearchInput ? ( //TODO: Make this better
                <div>Không tìm thấy lớp học nào</div>
              ) : (
                <div>Bạn đang không trong lớp học nào</div>
              )}
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 dark:text-neutral-300">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">Tất cả các lớp:</div>
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-[400px]"
            onChange={(e) => setAllClassroomSearchValue(e.currentTarget.value)}
            onKeyDown={(e) => handleSearchAllClassroom(e)}
          />
        </div>
        {!isAllClassroomLoading ? (
          allClassroomData && allClassroomData.length > 0 ? (
            <ClassListView classListData={allClassroomData} />
          ) : (
            <div>
              {allClassroomSearchInput ? ( //TODO: Make this better
                <div>Không tìm thấy lớp học nào</div>
              ) : (
                <div>Không có lớp học nào</div>
              )}
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
