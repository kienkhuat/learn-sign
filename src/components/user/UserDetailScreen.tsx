import React, { useState } from "react";
import UserSideMenu from "./UserSideMenu";
import { Loader2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { api } from "~/utils/api";

type PrivateProps = {
  userData: any;
  _refetch: (...args: any[]) => any;
};

export default function UserDetailScreen(props: PrivateProps) {
  const [isRoleEditing, setIsRoleEditing] = useState<boolean>(false);
  const [roleInput, setRoleInput] = useState<string>();

  const { mutateAsync: editRole, isLoading: isEditingRole } =
    api.user.setUserRole.useMutation({
      onSuccess(data, variables, context) {
        return props._refetch();
      },
    });

  const handleEditRole = async () => {
    if (!roleInput) return;
    await editRole({
      userId: props.userData.id,
      inputRole: roleInput,
    });
    setIsRoleEditing(false);
  };

  return (
    <>
      {true ? (
        <div className="flex h-[calc(100%-64px)] w-full">
          <UserSideMenu userData={props.userData} />
          <div className="w-full py-5 pr-6 pt-8">
            <div className="mb-5 flex flex-col justify-center">
              <div className="mb-3 text-3xl font-bold text-neutral-300">
                Thông tin người dùng
              </div>
              <div className="flex flex-col gap-3 text-lg">
                <div className="flex items-center gap-2">
                  <div className="font-bold">Họ và tên:</div>
                  <div>{props.userData?.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">Email:</div>
                  <div>{props.userData?.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">Role:</div>
                  <div>{props.userData?.role}</div>
                  {isRoleEditing ? (
                    <Select onValueChange={(e) => setRoleInput(e)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder="Role"
                          defaultValue={props.userData.role}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Học sinh</SelectItem>
                        <SelectItem value="teacher">Giảng viên</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <></>
                  )}
                  <div>
                    {isRoleEditing ? (
                      <div className="flex gap-2">
                        <Button
                          disabled={isEditingRole}
                          onClick={() => handleEditRole()}
                        >
                          {isEditingRole ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            "Lưu"
                          )}
                        </Button>
                        <Button
                          disabled={isEditingRole}
                          onClick={() => {
                            setRoleInput(undefined);
                            setIsRoleEditing(false);
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsRoleEditing(true)}>
                        Sửa
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </>
  );
}
