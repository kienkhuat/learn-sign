import React, { useState } from "react";
import { Loader2, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { ResourceUploadDropzone } from "~/components/ResourceUploadDropzone";
import { useUploadThing } from "~/utils/uploadthing";
import { UploadDropzoneWithPreview } from "~/components/UploadDropzoneWithPreview";
import { api } from "~/utils/api";

type PrivateProps = {
  isOpen: boolean;
  _setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  _refetchResources: (...args: any[]) => any;
  classroomId: string;
};

type InputType = {
  id: string;
  type: string;
  value?: string;
  placeholder: string;
  attachments?: File[];
}[];

export default function CreateResourceDialog(props: PrivateProps) {
  const [inputList, setInputList] = useState<InputType>();
  const [imageCoverFiles, setImageCoverFiles] = useState<File[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [resourceName, setResourceName] = useState<string>();
  const [resourceDescription, setResourceDescription] = useState<string>();

  const { data: sessionData } = useSession();

  const { mutateAsync: createResource, isLoading: isCreatingResource } =
    api.resource.createResource.useMutation({
      onSuccess(data, variables, context) {
        return props._refetchResources();
      },
    });

  const handleAddInput = (type: string) => {
    if (type === "text") {
      const newInputList = inputList
        ? [
            ...inputList,
            {
              id: uuidv4(),
              type: "text",
              value: "",
              placeholder: "Nhập văn bản",
            },
          ]
        : [
            {
              id: uuidv4(),
              type: "text",
              value: "",
              placeholder: "Nhập văn bản",
            },
          ];
      setInputList(newInputList);
    }
    if (type === "image") {
      const newInputList = inputList
        ? [
            ...inputList,
            {
              id: uuidv4(),
              type: "image",
              value: "",
              placeholder: "",
              attachments: [],
            },
          ]
        : [
            {
              id: uuidv4(),
              type: "image",
              value: "",
              placeholder: "",
              attachments: [],
            },
          ];
      setInputList(newInputList);
    }
  };

  const {
    startUpload: startUploadResourceImage,
    permittedFileInfo: resourceImagePermittedFileInfo,
    isUploading: isResourceImageUploading,
  } = useUploadThing("ResourceImage", {
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
  });

  const {
    startUpload: startUploadResourceAttachment,
    permittedFileInfo: resourceAttachmentPermittedFileInfo,
    isUploading: isResourceAttachmentUploading,
  } = useUploadThing("ResourceAttachment", {
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
  });

  const renderInputList = inputList?.map((input, index) => {
    if (input.type === "text") {
      return (
        <div key={input.id} className="flex gap-2">
          <Textarea
            placeholder={input.placeholder + ` ${index + 1}`}
            defaultValue={input.value}
            onChange={(e) => {
              const newInputList = inputList.map(
                (updatedInput, updatedIndex) => {
                  if (updatedInput.id === input.id) {
                    return { ...updatedInput, value: e.currentTarget.value };
                  } else return updatedInput;
                },
              );
              setInputList(newInputList);
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                const updatedList = inputList.filter((list, updatedIndex) => {
                  return list.id !== input.id;
                });
                setInputList([...updatedList]);
              }}
              className="dark:bg-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-950"
            >
              Xóa
            </Button>
          </div>
        </div>
      );
    }
    if (input.type === "image") {
      return (
        <div
          key={input.id}
          className="flex gap-2"
          onClick={() => console.log(inputList)}
        >
          <div className="flex w-full justify-center">
            {input.attachments &&
            input.attachments[0] &&
            input.attachments.length > 0 ? (
              <img
                className="max-h-[480px]"
                src={URL.createObjectURL(input.attachments[0])}
              />
            ) : (
              <div className="w-full">
                <ResourceUploadDropzone
                  permittedFileInfo={resourceImagePermittedFileInfo}
                  inputList={inputList}
                  inputId={input.id}
                  _setInputList={setInputList}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                const updatedList = inputList.filter((list, updatedIndex) => {
                  return list.id !== input.id;
                });
                setInputList([...updatedList]);
              }}
              className="dark:bg-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-950"
            >
              Xóa
            </Button>
            {input.attachments &&
              input.attachments[0] &&
              input.attachments.length > 0 && (
                <Button
                  onClick={() => {
                    const newInputList = inputList.map(
                      (updatedInput, updatedIndex) => {
                        if (updatedInput.id === input.id) {
                          return { ...updatedInput, attachments: [] };
                        }
                        return updatedInput;
                      },
                    );
                    setInputList(newInputList);
                  }}
                  className="dark:bg-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-950"
                >
                  Reset
                </Button>
              )}
          </div>
        </div>
      );
    }
  });

  const handleCreateResource = async () => {
    if (!inputList) return;
    if (!resourceName) return;
    const unresovedPromises = inputList.map(async (inputItem) => {
      const uploadedFiles =
        inputItem.type === "image" && inputItem.attachments
          ? await startUploadResourceImage(inputItem.attachments)
          : undefined;
      return {
        ...inputItem,
        attachments: uploadedFiles,
      };
    });
    const contentsToSend = await Promise.all(unresovedPromises);

    const uploadedImageCover = await startUploadResourceImage(imageCoverFiles);
    if (!uploadedImageCover) return;

    const uploadedAttachments =
      await startUploadResourceAttachment(attachmentFiles);

    await createResource({
      classroomId: props.classroomId,
      contents: contentsToSend,
      imageCover: uploadedImageCover[0]!,
      attachments: uploadedAttachments,
      name: resourceName,
      description: resourceDescription,
    });

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setInputList(undefined);
    setImageCoverFiles([]);
    setAttachmentFiles([]);
    setResourceDescription(undefined);
    setResourceName(undefined);
    props._setIsOpen(false);
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className=" p-0 dark:bg-neutral-900 dark:text-white  sm:min-w-[720px]">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>Thêm tài liệu</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex max-h-[900px] flex-col gap-4 overflow-y-scroll p-5 pr-0 pt-3">
            <div className="grid w-[99%]  items-center gap-2.5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="text-lg dark:text-neutral-300">
                    Tên tài liệu:
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Điền tên tài liệu..."
                      onChange={(e) => setResourceName(e.currentTarget.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-lg dark:text-neutral-300">
                    Giới thiệu:
                  </div>
                  <Textarea
                    placeholder="Điền giới thiệu..."
                    onChange={(e) =>
                      setResourceDescription(e.currentTarget.value)
                    }
                  />
                </div>

                <div>
                  <div className="text-lg dark:text-neutral-300">
                    Thêm ảnh bìa
                  </div>
                  <div className="w-[680px]">
                    <UploadDropzoneWithPreview
                      _setFiles={setImageCoverFiles}
                      files={imageCoverFiles}
                      permittedFileInfo={resourceImagePermittedFileInfo}
                      showPreview={true}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-lg dark:text-neutral-300">
                    Thêm Tệp đính kèm
                  </div>
                  <div className="w-[680px]">
                    <UploadDropzoneWithPreview
                      _setFiles={setAttachmentFiles}
                      files={attachmentFiles}
                      permittedFileInfo={resourceAttachmentPermittedFileInfo}
                      showPreview={true}
                    />
                  </div>
                </div>
              </div>
              <div className="text-lg dark:text-neutral-300">
                Thêm nội dung:
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button onClick={() => handleAddInput("text")}>
                    Thêm đoạn văn
                  </Button>
                  <Button onClick={() => handleAddInput("image")}>
                    Thêm ảnh
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">{renderInputList}</div>
              <div className="mr-1 flex justify-end gap-2">
                <Button
                  onClick={() => handleCloseDialog()}
                  className=" dark:bg-neutral-800 dark:text-white dark:hover:text-black"
                >
                  Đóng
                </Button>
                <Button
                  disabled={
                    isResourceImageUploading ||
                    isResourceAttachmentUploading ||
                    isCreatingResource
                  }
                  onClick={() => handleCreateResource()}
                >
                  {isResourceImageUploading ||
                  isResourceAttachmentUploading ||
                  isCreatingResource ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Tạo"
                  )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
