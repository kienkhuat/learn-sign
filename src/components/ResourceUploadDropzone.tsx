import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";

type PrivateProps = {
  permittedFileInfo: any; //TODO: type for this
  // files: File[];
  // _setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  // showPreview: boolean;
  inputId: string;
  inputList: {
    id: string;
    type: string;
    value?: string;
    placeholder: string;
    attachments?: File[];
  }[];
  _setInputList: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          type: string;
          value?: string;
          placeholder: string;
          attachments?: File[];
        }[]
      | undefined
    >
  >;
};

export function ResourceUploadDropzone(props: PrivateProps) {
  const { inputList } = props;
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const newInputList = props.inputList.map((updatedInput) => {
        if (updatedInput.id === props.inputId) {
          return { ...updatedInput, attachments: [...acceptedFiles] };
        }
        return updatedInput;
      });
      props._setInputList(newInputList);
    },
    [inputList],
  );

  //@ts-ignore
  const fileTypes = props.permittedFileInfo?.config
    ? Object.keys(props.permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div className="flex flex-col gap-2">
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
    </div>
  );
}
