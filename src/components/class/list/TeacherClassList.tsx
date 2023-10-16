import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import CreateClassDialog from "../dialog/CreateClassDialog";
import ClassListView from "./ClassListView";
import { UploadButton } from "~/utils/uploadthing";
import { base64Images } from "~/assets/base64Images";
import { api } from "~/utils/api";
import { Loader2Icon } from "lucide-react";

export default function TeacherClassList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classSearchInput, setClassSearchInput] = useState("");
  const [classSearchValue, setClassSearchValue] = useState("");

  const { data: sessionData } = useSession();

  const {
    data: classroomData,
    isLoading,
    refetch,
  } = api.classroom.findTeacherClassrooms.useQuery({
    userId: sessionData?.user.id || "",
    searchInput: classSearchInput,
  });

  const handleSearchClass = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setClassSearchInput(classSearchValue);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-10 overflow-auto px-2 py-5 pr-6 pt-8">
        <div className="flex flex-col gap-4 dark:text-neutral-300">
          <div className="flex justify-between">
            <div className="text-3xl font-bold">Lớp học của bạn:</div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-[400px]"
                onKeyDown={(e) => handleSearchClass(e)}
                onChange={(e) => setClassSearchValue(e.currentTarget.value)}
              />
              <Button onClick={() => setIsDialogOpen(true)}>Tạo Lớp</Button>
            </div>
          </div>
          {classroomData ? (
            <ClassListView classListData={classroomData} />
          ) : (
            <div className="flex w-full items-center justify-center py-6">
              <Loader2Icon className="animate-spin" size={"40px"} />
            </div>
          )}
        </div>
      </div>
      <CreateClassDialog
        isOpen={isDialogOpen}
        _setIsOpen={setIsDialogOpen}
        _refetch={refetch}
      />
    </>
  );
}
