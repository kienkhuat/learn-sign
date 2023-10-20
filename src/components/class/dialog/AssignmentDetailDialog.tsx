import React, { useEffect, useState } from "react";
import { FileIcon, FileX, Loader2, Loader2Icon, PlusIcon } from "lucide-react";
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
import { assignmentDataType, classroomDataType } from "~/types/types";
import {
  differenceInDays,
  differenceInMilliseconds,
  format,
  intervalToDuration,
} from "date-fns";
import Link from "next/link";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _refetchAssignment: (...args: any[]) => any;
  assignment: assignmentDataType;
  classroomData: classroomDataType;
};

export default function AssignmentDetailDialog(props: PrivateProps) {
  const [statusColor, setStatusColor] = useState<String>();
  const [statusTextColor, setStatusTextColor] = useState<String>();
  const [deadlineText, setDeadlineText] = useState<String>();

  const { data: sessionData } = useSession();

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
      setStatusTextColor("text-green-600");
    }
    if (!props.assignment.submissions.length) {
      if (differenceInMilliseconds(props.assignment.deadline, Date.now()) < 0) {
        setStatusColor("bg-red-600");
        setStatusTextColor("text-red-600");
      } else if (differenceInDays(props.assignment.deadline, Date.now()) < 1) {
        setStatusColor("bg-yellow-500");
        setStatusTextColor("text-yellow-500");
      } else {
        setStatusColor("bg-neutral-400");
        setStatusTextColor("text-neutral-400");
      }
    }
  }, [props.assignment]);

  const renderAttachments = props.assignment.attachments.length ? (
    props.assignment.attachments.map((attachment, index) => {
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
          className="overflow-hidden rounded-lg p-4 dark:bg-neutral-950"
        >
          <div className="flex items-center gap-2 truncate">
            <div>
              <FileIcon />
            </div>
            <div>{attachmentAsObject.name}</div>
          </div>
        </Link>
      );
    })
  ) : (
    <></>
  );

  // const renderSubmissions = props.assignment.submissions.map(submission => {
  //   return (
  //     <div>
  //       <div>{submission.}</div>
  //     </div>
  //   )
  // })

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
        <DialogContent className="p-0 dark:bg-neutral-900 dark:text-white sm:min-w-[800px]">
          {props.assignment ? (
            <>
              <DialogHeader className="overflow-hidden p-5 pb-0">
                <DialogTitle
                  className="truncate text-2xl font-bold"
                  onClick={() => console.log(props.assignment)}
                >
                  {`Bài tập: ${props.assignment.name}`}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="flex flex-col gap-4 p-5 pr-0 pt-3">
                <div className="grid max-h-[800px] w-[99%] items-center gap-2.5 overflow-y-scroll text-lg">
                  <div className="flex gap-1 text-xl">
                    <div className="dark:text-neutral-300">Yêu cầu:</div>
                    <div>{`${props.assignment.task}`}</div>
                  </div>

                  <div className="flex gap-1">
                    <div className="dark:text-neutral-300">Hạn:</div>
                    <div className={`${statusTextColor}`}>
                      {differenceInMilliseconds(
                        props.assignment.deadline,
                        Date.now(),
                      ) >= 0
                        ? `${format(
                            props.assignment.deadline,
                            "dd/MM/yyyy",
                          )} (Còn ${deadlineText})`
                        : `${format(
                            props.assignment.deadline,
                            "dd/MM/yyyy",
                          )} (Đã quá hạn ${deadlineText})`}
                    </div>
                  </div>
                  {props.assignment.attachments.length ? (
                    <div className="flex flex-col gap-2">
                      <div className="dark:text-neutral-300">Tệp đính kèm:</div>
                      <div className="flex gap-2 overflow-x-scroll">
                        {renderAttachments}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex justify-between">
                  <div></div>
                  <div className="flex pr-4">
                    {sessionData?.user.id === props.assignment.teacherId ? (
                      <div>
                        <Button
                          onClick={() => {}}
                          className="mr-2 dark:bg-red-800 dark:text-white"
                        >
                          {false ? <Loader2 className="animate-spin" /> : "Xóa"}
                        </Button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <Button
                      onClick={() => props._setIsOpen(false)}
                      className="dark:bg-neutral-800 dark:text-white dark:hover:bg-white dark:hover:text-black"
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </>
          ) : (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin"></Loader2Icon>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
