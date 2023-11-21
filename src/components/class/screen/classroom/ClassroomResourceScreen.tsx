import React, { useState } from "react";
import ClassDetailSideMenu from "../../ClassDetailSideMenu";
import { Loader2Icon } from "lucide-react";
import ClassroomStudentList from "../../list/classroom/ClassroomStudentList";
import { classroomDataType } from "~/types/types";
import ClassroomResourceList from "../../list/classroom/ClassroomResourceList";
import { api } from "~/utils/api";

type PrivateProps = {
  classroomData: classroomDataType;
  _refetch: (...args: any[]) => any;
  isLoading: boolean;
};

export default function ClassroomResourceScreen(props: PrivateProps) {
  const [resourceSearchInput, setResourceSearchInput] = useState<string>();
  const [sharedResourceSearchInput, setSharedResourceSearchInput] =
    useState<string>();

  const {
    data: resourceList,
    isLoading: isResourceListLoading,
    refetch: refetchResourceList,
  } = api.resource.findResources.useQuery({
    classroomId: props.classroomData?.id || "",
    searchInput: resourceSearchInput,
  });

  const {
    data: sharedResourceList,
    isLoading: isSharedResourceListLoading,
    refetch: refetchSharedResourceList,
  } = api.resource.findSharedResources.useQuery({
    searchInput: sharedResourceSearchInput,
  });

  return (
    <>
      {!props.isLoading ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <ClassDetailSideMenu classroomData={props.classroomData!} />
          <ClassroomResourceList
            classroomId={props.classroomData.id}
            _setResourceSearchInput={setResourceSearchInput}
            _setSharedResourceSearchInput={setSharedResourceSearchInput}
            _refetchResourceList={refetchResourceList}
            _refetchSharedResourceList={refetchSharedResourceList}
            isResourceListLoading={isResourceListLoading}
            isSharedResourceListLoading={isSharedResourceListLoading}
            resourceList={resourceList}
            sharedResourceList={sharedResourceList}
          />
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </>
  );
}
