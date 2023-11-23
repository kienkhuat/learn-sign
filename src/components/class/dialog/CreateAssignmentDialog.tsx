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
import { classroomDataType } from "~/types/types";
import { UploadDropzoneWithPreview } from "~/components/UploadDropzoneWithPreview";

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

    await startUpload(files)
      .then((res) => {
        createAssignment({
          attachments: res?.length ? [...res] : [],
          classroomId: props.classroomData.id,
          deadline: deadlineDate,
          name: assignmentName,
          task: task,
          teacherId: sessionData.user.id,
        });
      })
      .catch((e) => console.log(e));
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
                className="whitespace-pre-line"
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
              <UploadDropzoneWithPreview
                _setFiles={setFiles}
                files={files}
                permittedFileInfo={permittedFileInfo}
                showPreview={true}
              />
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
