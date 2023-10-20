import { Prisma } from "@prisma/client";
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  intervalToDuration,
} from "date-fns";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { assignmentDataType, classroomDataType } from "~/types/types";

type PrivateProps = {
  assignment: assignmentDataType;
  classroomData: classroomDataType;
  _setIsDetailAssignmentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _setSelectedAssignment: React.Dispatch<
    React.SetStateAction<assignmentDataType | undefined>
  >;
};

type submissionType = {
  id: string;
  assignmentId: string;
  grade: number;
  comment: string;
  teacherComment: string;
  attachments: Prisma.JsonValue[];
  studentId: string;
};

export default function ClassroomAssignmentCard(props: PrivateProps) {
  const [statusColor, setStatusColor] = useState<String>();
  const [deadlineTextColor, setDeadlineTextColor] = useState<String>();
  const [deadlineText, setDeadlineText] = useState<String>();
  const [studentSubmission, setStudentSubmission] = useState<submissionType>();

  const { data: sessionData } = useSession();

  useEffect(() => {
    if (!sessionData) return;
    if (sessionData.user.role === "student") {
      setStudentSubmission(
        props.assignment.submissions.find(
          (submission) => submission.studentId === sessionData.user.id,
        ),
      );
    }
  }, [sessionData]);

  useEffect(() => {
    if (
      intervalToDuration({
        start: props.assignment.deadline,
        end: Date.now(),
      }).days
    )
      setDeadlineText(
        `${
          intervalToDuration({
            start: props.assignment.deadline,
            end: Date.now(),
          }).days
        } Ngày`,
      );
    else if (
      intervalToDuration({
        start: props.assignment.deadline,
        end: Date.now(),
      }).hours
    )
      setDeadlineText(
        `${
          intervalToDuration({
            start: props.assignment.deadline,
            end: Date.now(),
          }).hours
        } Tiếng`,
      );
    else
      setDeadlineText(
        `${
          intervalToDuration({
            start: props.assignment.deadline,
            end: Date.now(),
          }).minutes
        } Phút`,
      );

    if (props.assignment.submissions.length) {
      setStatusColor("bg-green-600");
      setDeadlineTextColor("text-green-600");
    }
    if (!props.assignment.submissions.length) {
      if (differenceInMilliseconds(props.assignment.deadline, Date.now()) < 0) {
        setStatusColor("bg-red-600");
        setDeadlineTextColor("text-red-600");
      } else if (differenceInDays(props.assignment.deadline, Date.now()) < 1) {
        setStatusColor("bg-yellow-500");
        setDeadlineTextColor("text-yellow-500");
      } else {
        setStatusColor("bg-neutral-400");
        setDeadlineTextColor("text-neutral-400");
      }
    }
  }, []);

  const handleCardClick = () => {
    props._setSelectedAssignment(props.assignment);
    props._setIsDetailAssignmentOpen(true);
  };

  return (
    <div
      onClick={() => handleCardClick()}
      className="
        flex 
        h-full 
        cursor-pointer 
        overflow-hidden 
        rounded-lg
        shadow-md
        dark:bg-neutral-900
        dark:text-neutral-400
        dark:shadow-neutral-950
      "
    >
      <div className={`min-w-[32px] rounded-l-lg ${statusColor}`}></div>
      <div className="p-2 py-4">
        <div className="overflow-ellipsis whitespace-nowrap text-lg font-bold dark:text-neutral-100">
          {props.assignment.name}
        </div>
        <div className={`flex gap-1`}>
          <div className="font-bold">Hạn:</div>
          <div className={`${deadlineTextColor}`}>
            {differenceInMilliseconds(props.assignment.deadline, Date.now()) >=
            0
              ? `Còn ${deadlineText}`
              : `Đã quá hạn ${deadlineText}`}
          </div>
        </div>
        {sessionData?.user.role === "student" ? (
          <div>
            <div className={`flex gap-1`}>
              <div className="font-bold">Trạng thái:</div>
              <div>
                {`${studentSubmission ? "Đã hoàn thành" : "Chưa hoàn thành"}`}
              </div>
            </div>
            <div className={`flex gap-1`}>
              <div className="font-bold">Điểm:</div>
              <div>
                {`${
                  studentSubmission
                    ? `${studentSubmission.grade}/10`
                    : "Chưa có điểm"
                }`}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={`flex gap-1`}>
              <div className="font-bold">Đã nộp:</div>
              <div>{`${props.assignment.submissions.length}/${props.classroomData.students.length} Học sinh`}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
