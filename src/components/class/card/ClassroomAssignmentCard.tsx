import { Prisma } from "@prisma/client";
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  format,
  intervalToDuration,
  isBefore,
} from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  grade: number | null;
  comment: string | null;
  teacherComment: string | null;
  attachments: Prisma.JsonValue[];
  studentId: string;
  createdAt: Date;
};

export default function ClassroomAssignmentCard(props: PrivateProps) {
  const [statusColor, setStatusColor] = useState<String>();
  const [deadlineTextColor, setDeadlineTextColor] = useState<String>();
  const [deadlineText, setDeadlineText] = useState<String>();
  const [studentSubmission, setStudentSubmission] = useState<submissionType>();
  const [isSubmissionBeforeDeadline, setIsSubmissionBeforeDeadline] =
    useState<boolean>(
      studentSubmission &&
        isBefore(studentSubmission.createdAt, props.assignment.deadline)
        ? true
        : false,
    );

  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData) return;
    if (sessionData.user.role === "student") {
      setStudentSubmission(
        props.assignment.submissions.find(
          (submission) => submission.studentId === sessionData.user.id,
        ),
      );
    }
  }, [sessionData, props.assignment, router]);

  useEffect(() => {
    setIsSubmissionBeforeDeadline(
      studentSubmission &&
        isBefore(studentSubmission.createdAt, props.assignment.deadline)
        ? true
        : false,
    );
  }, [props.assignment, studentSubmission, router]);

  useEffect(() => {
    //Set Deadline Text
    const durationFromNow = intervalToDuration({
      start: props.assignment.deadline,
      end: Date.now(),
    });

    const durationFromCreatedDate =
      studentSubmission &&
      intervalToDuration({
        start: studentSubmission.createdAt,
        end: props.assignment.deadline,
      });

    if (isSubmissionBeforeDeadline && durationFromCreatedDate) {
      if (durationFromCreatedDate.days)
        setDeadlineText(`${durationFromCreatedDate.days} Ngày`);
      else if (durationFromCreatedDate.hours)
        setDeadlineText(`${durationFromCreatedDate.hours} Tiếng`);
      else setDeadlineText(`${durationFromCreatedDate.minutes} Phút`);
    } else {
      if (durationFromNow.days) setDeadlineText(`${durationFromNow.days} Ngày`);
      else if (durationFromNow.hours)
        setDeadlineText(`${durationFromNow.hours} Tiếng`);
      else setDeadlineText(`${durationFromNow.minutes} Phút`);
    }

    //Get Color

    if (isSubmissionBeforeDeadline) {
      setStatusColor("bg-green-600");
      setDeadlineTextColor("text-green-600");
    } else {
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
  }, [props.assignment, studentSubmission, isSubmissionBeforeDeadline]);

  const handleCardClick = () => {
    props._setSelectedAssignment(props.assignment);
    props._setIsDetailAssignmentOpen(true);
  };

  const isTeacherOrAdmin =
    sessionData?.user.role === "teacher" || sessionData?.user.role === "admin";

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
      <div
        className={`min-w-[32px] rounded-l-lg ${
          isTeacherOrAdmin ? "bg-neutral-400" : statusColor
        }`}
      ></div>
      <div className="p-2 py-4">
        <div className="overflow-ellipsis whitespace-nowrap text-lg font-bold dark:text-neutral-100">
          {props.assignment.name}
        </div>
        <div className={`flex gap-1`}>
          <div className="font-bold">Hạn:</div>
          <div className={`${isTeacherOrAdmin ? "" : deadlineTextColor}`}>
            {isTeacherOrAdmin ? (
              format(props.assignment.deadline, "dd/MM/yyyy")
            ) : (
              <div>
                {studentSubmission
                  ? isSubmissionBeforeDeadline
                    ? `Nộp sớm ${deadlineText}`
                    : `Nộp muộn ${deadlineText}`
                  : differenceInMilliseconds(
                      props.assignment.deadline,
                      Date.now(),
                    ) >= 0
                  ? `Còn ${deadlineText}`
                  : `Đã quá hạn ${deadlineText}`}
              </div>
            )}
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
                  studentSubmission && studentSubmission.grade
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
