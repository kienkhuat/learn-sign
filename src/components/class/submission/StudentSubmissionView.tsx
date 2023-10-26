import FileSaver from "file-saver";
import { DownloadIcon, FileIcon, Loader2Icon } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { UploadDropzoneWithPreview } from "~/components/UploadDropzoneWithPreview";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  assignmentDataType,
  classroomDataType,
  studentSubmissionsType,
} from "~/types/types";
import { api } from "~/utils/api";
import { useUploadThing } from "~/utils/uploadthing";

type PrivateProps = {
  _refetchAssignment: (...args: any[]) => any;
  _refetchSubmission: (...args: any[]) => any;
  assignment: assignmentDataType;
  classroomData: classroomDataType;
  sessionData: Session;
  studentSubmissions: studentSubmissionsType;
  isSubmissionLoading: boolean;
};

export default function StudentSubmissionView(props: PrivateProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [commentInput, setCommentInput] = useState<string>();

  const { mutateAsync: addSubmission, isLoading: isAddingSubmission } =
    api.submission.createSubmission.useMutation({
      onSuccess(data, variables, context) {
        props._refetchSubmission();
        props._refetchAssignment();
      },
    });

  const { mutateAsync: deleteSubmission, isLoading: isDeletingSubmission } =
    api.submission.deleteSubmission.useMutation({
      onSuccess(data, variables, context) {
        props._refetchSubmission();
        props._refetchAssignment();
      },
    });

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "Submission",
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

  const handleAddSubmission = async () => {
    if (!props.sessionData) return;
    if (!files || !files.length) return;

    await startUpload(files).then((res) => {
      if (res && res.length) {
        addSubmission({
          assignmentId: props.assignment.id,
          studentId: props.sessionData.user.id,
          attachments: [...res],
          comment: commentInput,
        });
      } else {
        console.log("res is empty");
      }
    });
    setFiles([]);
  };

  const renderAddSubmission = () => {
    return (
      <div className="flex flex-col">
        <div className="dark:text-neutral-300">Thêm bài nộp:</div>
        <div className="flex flex-col gap-2 rounded-lg border-[1px] border-solid border-neutral-500 p-4">
          <div className="flex flex-col gap-2">
            <div>Bình luận:</div>
            <Textarea
              placeholder="Nhập bình luận..."
              onChange={(e) => setCommentInput(e.currentTarget.value)}
              className="whitespace-pre-line"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>Tệp đính kèm:</div>
            <UploadDropzoneWithPreview
              _setFiles={setFiles}
              files={files}
              permittedFileInfo={permittedFileInfo}
              showPreview={true}
            />
          </div>
          <div className="flex justify-between">
            <div></div>
            <div>
              <Button
                className="dark:bg-neutral-300"
                disabled={isAddingSubmission || isUploading}
                onClick={() => handleAddSubmission()}
              >
                {!isAddingSubmission && !isUploading ? (
                  "Thêm bài nộp"
                ) : (
                  <Loader2Icon className="animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttachments =
    props.studentSubmissions &&
    props.studentSubmissions[0]?.attachments.length ? (
      props.studentSubmissions[0]?.attachments.map((attachment, index) => {
        const attachmentAsObject = attachment as {
          key: string;
          name: string;
          url: string;
        };
        return (
          <Link
            href={attachmentAsObject.url}
            download={attachmentAsObject.url}
            target="_blank"
            key={index}
            className=" rounded-lg p-1 px-2 dark:bg-neutral-800 dark:hover:bg-neutral-800"
          >
            <div className="flex items-center gap-2 truncate">
              <div>
                <FileIcon />
              </div>
              <div>{attachmentAsObject.name}</div>
              <div>
                <DownloadIcon
                  className="dark:hover:text-neutral-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    FileSaver.saveAs(
                      attachmentAsObject.url,
                      attachmentAsObject.name,
                    );
                  }}
                />
              </div>
            </div>
          </Link>
        );
      })
    ) : (
      <></>
    );

  const handleDeleteSubmission = async () => {
    if (
      !props.studentSubmissions ||
      !props.studentSubmissions[0] ||
      !props.studentSubmissions.length
    ) {
      return;
    }
    await deleteSubmission({
      submissionId: props.studentSubmissions[0].id,
    });
  };

  const renderSubmissionCard = () => {
    if (props.studentSubmissions)
      return (
        <div className="flex flex-col gap-2">
          <div className="dark:text-neutral-300">Bài nộp:</div>
          <div className="flex flex-col gap-2 rounded-lg p-4 dark:bg-neutral-950 ">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">Tên học sinh:</div>
                <div>{props.studentSubmissions[0]?.student.name}</div>
              </div>
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">Điểm:</div>
                <div>
                  {props.studentSubmissions[0]?.grade
                    ? `${props.studentSubmissions[0].grade}/10`
                    : "Chưa chấm điểm"}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">
                  Đánh giá của giáo viên:
                </div>
                <div className="whitespace-pre-line">
                  {props.studentSubmissions[0]?.teacherComment
                    ? `${props.studentSubmissions[0].teacherComment}`
                    : "Chưa có bình luận của giáo viên"}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">
                  Bình luận của học sinh:
                </div>
                <div className="whitespace-pre-line">
                  {props.studentSubmissions[0]?.comment
                    ? `${props.studentSubmissions[0].comment}`
                    : "Chưa có bình luận của học sinh"}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-auto whitespace-nowrap dark:text-neutral-300">
                  Tệp đính kèm:
                </div>
                <div className="flex flex-col gap-2 overflow-x-scroll">
                  <div className="flex flex-wrap gap-2">
                    {renderAttachments}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div></div>
              <div className="flex gap-2">
                <Button
                  size={"sm"}
                  className="dark:bg-red-800 dark:text-white dark:hover:bg-red-400"
                  onClick={() => handleDeleteSubmission()}
                  disabled={isDeletingSubmission}
                >
                  {isDeletingSubmission ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Xóa"
                  )}
                </Button>
                <Button size={"sm"} className="dark:bg-neutral-300">
                  Sửa
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col gap-2">
      {!props.isSubmissionLoading ? (
        <div>
          {props.studentSubmissions?.length ? (
            <div className="">{renderSubmissionCard()}</div>
          ) : (
            <div>{renderAddSubmission()}</div>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </div>
  );
}
