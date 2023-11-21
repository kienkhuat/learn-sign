import React, { useState } from "react";
import ResourceDetailDialog from "../../dialog/ResourceDetailDialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import CreateResourceDialog from "../../dialog/CreateResourceDialog";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";

type PrivateProps = {
  classroomId: string;
  _setResourceSearchInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  isResourceListLoading: boolean;
  _refetchResourceList: (...args: any[]) => any;
  resourceList:
    | ({
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
        resourceShare: string;
      })[]
    | undefined;
};

type resourceType = {
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

export default function ClassroomResourceList(props: PrivateProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<resourceType>();
  const [resourceCreateType, setResourceCreateType] =
    useState<string>("notShared");

  const { data: sessionData } = useSession();

  const notSharedResourceList = props.resourceList?.filter((resource) => {
    return resource.resourceShare === "notShared";
  });

  const sharedResourceList = props.resourceList?.filter((resource) => {
    return resource.resourceShare === "shared";
  });

  const renderResourceList = (shared: string) => {
    const resourceListToRender =
      shared === "shared" ? sharedResourceList : notSharedResourceList;
    const listToRender = resourceListToRender?.map((resource, index) => {
      const imageCoverAsObject = resource.imageCover as {
        key: string;
        name: string;
        url: string;
      };
      return (
        <div
          key={resource.id}
          onClick={() => {
            setIsDetailDialogOpen(true);
            setSelectedResource(resource);
          }}
          className="cursor-pointer rounded-lg shadow-md dark:bg-neutral-900 dark:shadow-neutral-950"
        >
          <div className="overflow-hidden rounded-t-lg">
            <img
              className="h-[180px] w-full object-cover transition-all duration-300 hover:scale-110"
              src={imageCoverAsObject.url}
            />
          </div>
          <div className="flex justify-center py-2 font-bold">
            {resource.name}
          </div>
        </div>
      );
    });

    return listToRender;
  };

  return (
    <>
      <div className="w-full py-5 pr-6 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-3xl font-bold text-neutral-300">
            Danh sách tài liệu chung
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-[300px] transition-all duration-200 focus:w-[400px]"
            />
            {sessionData?.user.role === "admin" ? (
              <Button
                onClick={() => {
                  setResourceCreateType("shared");
                  setIsCreateDialogOpen(true);
                }}
              >
                Thêm
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {!props.isResourceListLoading &&
        sharedResourceList &&
        sharedResourceList.length > 0 ? (
          <div className="3xl:grid-cols-5 grid w-full grid-cols-4 gap-4">
            {renderResourceList("shared")}
          </div>
        ) : (
          <div>Chưa có tài liệu chung</div>
        )}
        <div className="mb-5 mt-7 flex items-center justify-between">
          <div className="text-3xl font-bold text-neutral-300">
            Danh sách tài liệu lớp
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-[300px] transition-all duration-200 focus:w-[400px]"
            />
            {sessionData?.user.role !== "student" ? (
              <Button
                onClick={() => {
                  setResourceCreateType("notShared");
                  setIsCreateDialogOpen(true);
                }}
              >
                Thêm
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {!props.isResourceListLoading &&
        notSharedResourceList &&
        notSharedResourceList.length > 0 ? (
          <div className="3xl:grid-cols-5 grid w-full grid-cols-4 gap-4">
            {renderResourceList("notShared")}
          </div>
        ) : (
          <div>Chưa có tài liệu riêng</div>
        )}
      </div>
      <CreateResourceDialog
        _setIsOpen={setIsCreateDialogOpen}
        isOpen={isCreateDialogOpen}
        classroomId={props.classroomId}
        _refetchResources={props._refetchResourceList}
        resourceCreateType={resourceCreateType}
      />
      {selectedResource && (
        <ResourceDetailDialog
          _setIsOpen={setIsDetailDialogOpen}
          isOpen={isDetailDialogOpen}
          resource={selectedResource}
          _refetchResource={props._refetchResourceList}
        />
      )}
    </>
  );
}
