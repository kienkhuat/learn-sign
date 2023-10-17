// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import {
  UploadFileResponse,
  generateClientDropzoneAccept,
} from "uploadthing/client";

import { useUploadThing } from "~/utils/uploadthing";

type PrivateProps = {
  _startUpload: (
    files: File[],
    input?: undefined,
  ) => Promise<UploadFileResponse[] | undefined>;
  permittedFileInfo: any; //TODO: type for this
  files: File[];
  _setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export function AssignmentUploadDropzone(props: PrivateProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    props._setFiles(acceptedFiles);
  }, []);

  const fileTypes = props.permittedFileInfo?.config
    ? Object.keys(props.permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer rounded-xl border-2 border-solid dark:border-stone-800"
    >
      <input {...getInputProps()} />
      <div className="m-1 flex flex-col items-center justify-center rounded-lg p-4 dark:bg-stone-950 dark:hover:bg-stone-900">
        <div>
          <UploadCloud className="h-[60px] w-[60px]" />
        </div>
        <div>Chọn file hoặc kéo thả ở đây</div>
      </div>
    </div>
  );
}

{
  /* <div>
  {files.length > 0 && (
    <button onClick={() => startUpload(files)}>
      Upload {files.length} files
    </button>
  )}
</div> */
}
