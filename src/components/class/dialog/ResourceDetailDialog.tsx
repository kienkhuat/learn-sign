import React, { useState } from "react";
import { DownloadIcon, FileIcon, Loader2, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import FileSaver from "file-saver";
import Link from "next/link";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // _refetch: (...args: any[]) => any;
  resource: {
    classroom: {
      id: string;
      name: string;
      createdAt: Date;
      teacherId: string;
      coverImage: string;
    };
  } & {
    id: string;
    name: string;
    imageCover: Prisma.JsonValue;
    contents: Prisma.JsonValue[];
    description: string | null;
    attachments: Prisma.JsonValue[];
    classroomId: string;
    createdAt: Date;
  };
};

export default function ResourceDetailDialog(props: PrivateProps) {
  const { data: sessionData } = useSession();

  const renderContent = props.resource.contents?.map((content, index) => {
    const contentAsObject = content as {
      id: string;
      type: string;
      value: string;
      attachments: [
        {
          key: string;
          name: string;
          url: string;
        },
      ];
    };

    if (contentAsObject.type === "image") {
      return (
        <div key={index} className="flex justify-center">
          <img src={contentAsObject.attachments[0].url} />
        </div>
      );
    }
    return (
      <div key={index}>
        <div className="whitespace-pre-line">{contentAsObject.value}</div>
      </div>
    );
  });

  const renderAttachments = props.resource.attachments.length ? (
    props.resource.attachments.map((attachment, index) => {
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
          className=" rounded-lg p-4 dark:bg-neutral-950 dark:hover:bg-neutral-800"
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

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props._setIsOpen}>
        <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white  sm:min-w-[900px]">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>{props.resource.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex max-h-[900px] flex-col gap-4 overflow-y-scroll p-5 pr-0 pt-3">
            <div className="grid w-[99%]  items-center gap-2.5">
              {props.resource.description ? (
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-bold dark:text-neutral-300">
                    Giới thiệu:
                  </div>
                  <div className="flex flex-col gap-2 text-lg">
                    {props.resource.description}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {props.resource.attachments &&
              props.resource.attachments[0] &&
              props.resource.attachments.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-bold dark:text-neutral-300">
                    Tệp đính kèm:
                  </div>
                  <div className="flex flex-col gap-2 overflow-x-scroll">
                    <div className="flex gap-2">{renderAttachments}</div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-col gap-2">
                <div className="text-2xl font-bold dark:text-neutral-300">
                  Nội dung:
                </div>
                <div className="flex flex-col gap-2 text-lg">
                  {renderContent}
                </div>
              </div>
              <div className="mr-1 flex justify-end gap-2">
                <Button
                  onClick={() => props._setIsOpen(false)}
                  className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
