import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { FileTextIcon, ImageIcon, UploadCloud, XIcon } from "lucide-react";
import { useCallback } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";

type PrivateProps = {
  permittedFileInfo: any; //TODO: type for this
  files: File[];
  _setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  showPreview: boolean;
};

export function UploadDropzoneWithPreview(props: PrivateProps) {
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

  const removeFileToUpload = (index: number) => {
    const updatedFiles = props.files.filter((file, i) => i !== index);
    props._setFiles(updatedFiles);
  };

  const renderFilePreview = props.files.map((file, index) => {
    return (
      <div
        key={index}
        className="relative flex items-center gap-2 rounded-lg p-4 py-5 dark:bg-stone-950"
      >
        <div
          onClick={() => removeFileToUpload(index)}
          className="absolute right-2 top-2 cursor-pointer hover:dark:text-neutral-100"
        >
          <XIcon className="h-[18px] w-[18px]" />
        </div>
        <div>
          {file.type.slice(0, 5) === "image" ? <ImageIcon /> : <FileTextIcon />}
        </div>
        <div>{file.name}</div>
      </div>
    );
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
      {props.showPreview ? (
        <div className="flex gap-2 overflow-x-scroll">{renderFilePreview}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
