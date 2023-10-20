import React, { useState } from "react";
import {
  CalendarIcon,
  FileTextIcon,
  ImageIcon,
  Loader2,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { base64Images } from "~/assets/base64Images";
import { Textarea } from "~/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import {
  UploadButton,
  UploadDropzone,
  useUploadThing,
} from "~/utils/uploadthing";
import { AssignmentUploadDropzone } from "../AssignmentUploadDropzone";
import { classroomDataType } from "~/types/types";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _refetch: (...args: any[]) => any;
  classroomData: classroomDataType;
  isLoading: boolean;
};

type uploadedFilesDataType = {
  key: string;
  name: string;
  url: string;
}[];

export default function CreateAssignmentDialog(props: PrivateProps) {
  const [files, setFiles] = useState<File[]>([]);

  const [assignmentName, setAssignmentName] = useState("");
  const [task, setTask] = useState("");
  const [deadlineDate, setDeadlineDate] = React.useState<Date>();
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);

  const { data: sessionData } = useSession();

  const {
    mutateAsync: createAssignment,
    isLoading: isCreateAssignmentLoading,
  } = api.assignment.createAssignment.useMutation({
    onSuccess(data, variables, context) {
      console.log("Success create assignment", data);
      return props._refetch();
    },
  });

  const handleCreateAssignment = async () => {
    if (!sessionData) return false;
    if (!deadlineDate || !assignmentName) return false;

    await startUpload(files).then((res) => {
      createAssignment({
        attachments: res?.length ? [...res] : [],
        classroomId: props.classroomData.id,
        deadline: deadlineDate,
        name: assignmentName,
        task: task,
        teacherId: sessionData.user.id,
      });
    });
    closeDialog();
  };

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "Assignment",
    {
      onClientUploadComplete: (res) => {
        if (!res) return console.log("No res in upload complete");
        console.log("uploaded successfully!");
        return res;
      },
      onUploadError: () => {
        console.log("error occurred while uploading");
      },
      onUploadBegin: () => {
        console.log("upload has begun");
      },
      onUploadProgress: (progress) => {
        console.log({ progress });
      },
    },
  );

  const removeFileToUpload = (index: number) => {
    const updatedFiles = files.filter((file, i) => i !== index);
    setFiles(updatedFiles);
  };

  const renderFilePreview = files.map((file, index) => {
    return (
      <div
        key={index}
        className="relative flex items-center gap-2 rounded-lg p-4 py-5 dark:bg-stone-950"
      >
        <div
          onClick={() => removeFileToUpload(index)}
          className="absolute right-2 top-2 cursor-pointer hover:dark:text-neutral-100"
        >
          <XIcon className="h-[18px] w-[18px]" />
        </div>
        <div>
          {file.type.slice(0, 5) === "image" ? <ImageIcon /> : <FileTextIcon />}
        </div>
        <div>{file.name}</div>
      </div>
    );
  });

  const closeDialog = () => {
    setFiles([]);
    setDeadlineDate(undefined);
    setAssignmentName("");
    setTask("");
    props._setIsOpen(false);
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={closeDialog}>
        <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>Tạo bài tập</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex  flex-col gap-4  p-5 pr-0 pt-3">
            <div className="grid max-h-[600px]  w-[99%] items-center gap-2.5 overflow-y-scroll p-1">
              <Label htmlFor="assignmentName">Tên bài tập:</Label>
              <Input
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setAssignmentName(e.currentTarget.value)
                }
                type="text"
                placeholder="Nhập tên bài tập..."
                required
              />

              <Label htmlFor="task">Yêu cầu:</Label>
              <Textarea
                onChange={(e) => setTask(e.currentTarget.value)}
                placeholder="Nhập yêu cầu bài tập..."
                required
              />

              <Label htmlFor="deadline">Ngày hạn:</Label>
              <Popover
                open={isDateSelectorOpen}
                onOpenChange={setIsDateSelectorOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !deadlineDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineDate ? (
                      format(deadlineDate, "PPP")
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadlineDate}
                    onSelect={(day) => {
                      setIsDateSelectorOpen(false);
                      return setDeadlineDate(day);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Label htmlFor="deadline">Tệp đính kèm:</Label>
              <AssignmentUploadDropzone
                _startUpload={startUpload}
                permittedFileInfo={permittedFileInfo}
                files={files}
                _setFiles={setFiles}
              />
              <div className="flex gap-2 overflow-x-scroll">
                {renderFilePreview}
              </div>
            </div>
            <div className="mr-7 flex justify-end gap-2">
              <Button
                disabled={
                  isCreateAssignmentLoading || isUploading ? true : false
                }
                onClick={() => props._setIsOpen(false)}
                className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
              >
                Đóng
              </Button>
              <Button onClick={() => handleCreateAssignment()}>
                {(isCreateAssignmentLoading || isUploading ? true : false) ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Tạo"
                )}
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
