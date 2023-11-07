import { JsonValue } from "@prisma/client/runtime/library";
import { intervalToDuration, isAfter } from "date-fns";
import FileSaver from "file-saver";
import { DownloadIcon, FileIcon, Loader2Icon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  assignmentDataType,
  classroomDataType,
  studentSubmissionsType,
} from "~/types/types";
import { api } from "~/utils/api";

type PrivateProps = {
  _refetchAssignment: (...args: any[]) => any;
  _refetchSubmission: (...args: any[]) => any;
  assignment: assignmentDataType;
  classroomData: classroomDataType;
  sessionData: Session;
  studentSubmissions: studentSubmissionsType;
  isSubmissionLoading: boolean;
};

type commentClamp = string[];

export default function TeacherSubmissionView(props: PrivateProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [studentCommentClamp, setStudentCommentClamp] = useState<commentClamp>(
    [],
  );
  const [teacherCommentClamp, setTeacherCommentClamp] = useState<commentClamp>(
    [],
  );

  const [submissionGrading, setSubmissionGrading] = useState<string>();
  const [gradeInput, setGradeInput] = useState<number | null>();
  const [teacherCommentInput, setTeacherCommentInput] = useState<string>();

  const {
    data: submissionList,
    isLoading: isSubmissionListLoading,
    refetch: refetchSubmissionList,
  } = api.submission.findSubmissionList.useQuery({
    assignmentId: props.assignment.id,
    searchInput: searchInput,
  });

  const { mutateAsync: gradeSubmission, isLoading: isGradingSubmission } =
    api.submission.gradeSubmission.useMutation({
      onSuccess(data, variables, context) {
        return refetchSubmissionList();
      },
    });

  const renderAttachments = (attachments: JsonValue[]) => {
    return attachments.map((attachment, index) => {
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
    });
  };

  const handleSeeMore = (submissionId: string, commentType: string) => {
    if (commentType === "student") {
      if (studentCommentClamp.find((id) => id === submissionId)) {
        const newStudentCommentClamp = studentCommentClamp.filter(
          (id) => id !== submissionId,
        );
        setStudentCommentClamp([...newStudentCommentClamp]);
      } else {
        setStudentCommentClamp([...studentCommentClamp, submissionId]);
      }
    } else {
      if (teacherCommentClamp.find((id) => id === submissionId)) {
        const newTeacherCommentClamp = teacherCommentClamp.filter(
          (id) => id !== submissionId,
        );
        setTeacherCommentClamp([...newTeacherCommentClamp]);
      } else {
        setTeacherCommentClamp([...teacherCommentClamp, submissionId]);
      }
    }
  };

  const renderComments = (
    submissionId: string,
    comment: string | null,
    type: string,
  ) => {
    const labelText =
      type === "student"
        ? "Bình luận của học sinh:"
        : "Đánh giá của giáo viên:";
    const commentEmptyText =
      type === "student"
        ? "Chưa có bình luận của học sinh:"
        : "Chưa có đánh giá của giáo viên:";

    const commentLine = comment?.split("\n").length || 0;
    const commentLength = comment?.length || 0;
    const isStudentCommentClamp = studentCommentClamp.find(
      (id) => id === submissionId,
    )
      ? false
      : true;
    const isTeacherCommentClamp = teacherCommentClamp.find(
      (id) => id === submissionId,
    )
      ? true
      : false;

    const isClamp =
      type === "student" ? isStudentCommentClamp : isTeacherCommentClamp;

    return (
      <div className="flex gap-2">
        <div className="whitespace-nowrap dark:text-neutral-300">
          {labelText}
        </div>
        <div>
          {comment ? (
            <div>
              <div
                className={`${
                  isClamp ? "line-clamp-3" : ""
                } whitespace-pre-line break-all`}
              >
                {comment}
              </div>
              {commentLine > 3 || commentLength > 190 ? (
                <>
                  {isClamp ? (
                    <div className="mb-2 flex">
                      <div
                        className="cursor-pointer rounded-lg px-1 text-sm dark:bg-neutral-700 hover:dark:bg-neutral-600"
                        onClick={() =>
                          handleSeeMore(
                            submissionId,
                            `${type === "student" ? "student" : "teacher"}`,
                          )
                        }
                      >
                        Xem thêm
                      </div>
                    </div>
                  ) : (
                    <div className="mb-2 flex">
                      <div
                        className="cursor-pointer rounded-lg px-1 text-sm dark:bg-neutral-700 hover:dark:bg-neutral-600"
                        onClick={() =>
                          handleSeeMore(
                            submissionId,
                            `${type === "student" ? "student" : "teacher"}`,
                          )
                        }
                      >
                        Thu gọn
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div>{commentEmptyText}</div>
          )}
        </div>
      </div>
    );
  };

  const handleSaveGrading = async (submissionId: string) => {
    if (!gradeInput) return;

    await gradeSubmission({
      gradeInput,
      submissionId,
      teacherCommentInput,
    });

    setGradeInput(null);
    setTeacherCommentInput(undefined);
    setSubmissionGrading(undefined);
  };

  const renderSubmissionList = () => {
    const submissionListToRender = submissionList?.map((submission, key) => {
      const durationFromDeadline = intervalToDuration({
        start: submission.createdAt,
        end: props.assignment.deadline,
      });
      let submissionStatus: string;
      let submissionStatusColor: string;
      if (isAfter(submission.createdAt, props.assignment.deadline)) {
        submissionStatusColor = "text-red-600";
        if (durationFromDeadline.days) {
          submissionStatus = `Nộp muộn ${durationFromDeadline.days} Ngày`;
        } else if (durationFromDeadline.hours) {
          submissionStatus = `Nộp muộn ${durationFromDeadline.hours} Giờ`;
        } else {
          submissionStatus = `Nộp muộn ${durationFromDeadline.minutes} Phút`;
        }
      } else {
        submissionStatusColor = "text-green-600";
        if (durationFromDeadline.days) {
          submissionStatus = `Nộp sớm ${durationFromDeadline.days} Ngày`;
        } else if (durationFromDeadline.hours) {
          submissionStatus = `Nộp sớm ${durationFromDeadline.hours} Giờ`;
        } else {
          submissionStatus = `Nộp sớm ${durationFromDeadline.minutes} Phút`;
        }
      }

      const isGrading = submission.id === submissionGrading;

      return (
        <div className="flex rounded-lg dark:bg-neutral-950">
          <div
            className={`min-w-[24px] rounded-l-lg ${
              submission.grade ? "bg-green-600" : "bg-neutral-500"
            } `}
          ></div>
          <div className="flex w-full flex-col justify-between px-4 py-2">
            <div className="">
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">Tên học sinh:</div>
                <div>{submission.student.name}</div>
              </div>
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">Điểm:</div>
                <div>
                  {submission.grade ? `${submission.grade}/10` : "Chưa có điểm"}
                </div>
              </div>
              <div>
                {renderComments(
                  submission.id,
                  submission.teacherComment,
                  "teacher",
                )}
              </div>
              <div>
                {renderComments(submission.id, submission.comment, "student")}
              </div>
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">Tình trạng nộp:</div>
                <div className={`${submissionStatusColor}`}>
                  {submissionStatus}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="dark:text-neutral-300">Tệp đính kèm:</div>
                <div className="flex flex-wrap gap-2">
                  {submission.attachments && submission.attachments.length ? (
                    renderAttachments(submission.attachments)
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div></div>
              <div className="flex gap-2">
                <Button
                  size={"sm"}
                  className="dark:bg-neutral-800 dark:text-neutral-300 hover:dark:text-neutral-950"
                  onClick={() => {
                    if (!submissionGrading) {
                      setSubmissionGrading(submission.id);
                      return;
                    } else if (submissionGrading !== submission.id) {
                      setSubmissionGrading(submission.id);
                    } else {
                      setSubmissionGrading(undefined);
                    }
                    setGradeInput(null);
                    setTeacherCommentInput(undefined);
                  }}
                >
                  {isGrading
                    ? "Hủy"
                    : `${submission.grade ? "Sửa điểm" : "Chấm điểm"}`}
                </Button>
                {isGrading ? (
                  <Button
                    size={"sm"}
                    className="dark:bg-neutral-300 dark:text-neutral-800"
                    onClick={() => handleSaveGrading(submission.id)}
                    disabled={isGradingSubmission}
                  >
                    {isGradingSubmission ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Lưu"
                    )}
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {isGrading ? (
              <div className="mt-2 flex flex-col gap-2 border-t-[1px] dark:border-neutral-600">
                <div className="mt-2 flex items-center gap-10">
                  <div className="dark:text-neutral-300">Điểm:</div>
                  <div className="w-[40%]">
                    <Input
                      type="number"
                      placeholder="Nhập điểm... (VD: 9)"
                      defaultValue={submission.grade || undefined}
                      onChange={(e) =>
                        setGradeInput(e.currentTarget.valueAsNumber)
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="whitespace-nowrap dark:text-neutral-300">
                    Đánh giá:
                  </div>
                  <div className="w-[40%]">
                    <Textarea
                      placeholder="Nhập đánh giá..."
                      defaultValue={submission.teacherComment || undefined}
                      onChange={(e) =>
                        setTeacherCommentInput(e.currentTarget.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    });

    return (
      <div className=" grid grid-cols-2 gap-2">{submissionListToRender}</div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className="whitespace-nowrap dark:text-neutral-300"
          onClick={() => console.log(submissionList)}
        >
          Danh sách bài nộp:
        </div>
        <Input
          type="text"
          color="neutral-950"
          className="mr-2 w-[400px]"
          placeholder="Tìm kiếm..."
          onChange={(e) => setSearchInputValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchInput(searchInputValue);
            }
          }}
        />
      </div>
      {isSubmissionListLoading ? (
        <div className="flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : submissionList && submissionList.length ? (
        <div className="mt-3">{renderSubmissionList()}</div>
      ) : (
        <div>
          {searchInput ? (
            <div>Không tìm thấy bài nộp</div>
          ) : (
            <div>Chưa có bài nộp</div>
          )}
        </div>
      )}
    </div>
  );
}
