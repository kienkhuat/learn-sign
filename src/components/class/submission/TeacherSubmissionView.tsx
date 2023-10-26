import FileSaver from "file-saver";
import { DownloadIcon, FileIcon, Loader2Icon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
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

export default function TeacherSubmissionView(props: PrivateProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const { data: submissionList, isLoading: isSubmissionListLoading } =
    api.submission.findSubmissionList.useQuery({
      assignmentId: props.assignment.id,
      searchInput: searchInput,
    });

  const renderAttachments =
    submissionList && submissionList[0]?.attachments.length ? (
      submissionList[0]?.attachments.map((attachment, index) => {
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

  const renderSubmissionList = () => {
    const submissionListToRender = submissionList?.map((submission, key) => {
      return (
        <div className="rounded-lg p-2 dark:bg-neutral-950">
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
          <div className="flex gap-2">
            <div className="dark:text-neutral-300">Đánh giá của giáo viên:</div>
            <div className="whitespace-pre-line">
              {submission.teacherComment
                ? submission.teacherComment
                : "Chưa có bình luận của giáo viên"}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="dark:text-neutral-300">Bình luận của học sinh:</div>
            <div className="whitespace-pre-line">
              {submission.comment
                ? submission.comment
                : "Chưa có bình luận của học sinh"}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="dark:text-neutral-300">Tình trạng nộp:</div>
            <div>{`TODO: ...`}</div>
          </div>
          <div className="flex gap-2">
            <div className="dark:text-neutral-300">Tệp đính kèm:</div>
            <div className="flex flex-wrap gap-2">{renderAttachments}</div>
          </div>
        </div>
      );
    });

    return <div className="flex flex-col gap-2">{submissionListToRender}</div>;
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
