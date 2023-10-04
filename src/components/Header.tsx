import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { BookOpen, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="sticky top-0 flex min-h-[64px] w-full items-center justify-between px-5 py-3 pl-12 shadow-sm dark:bg-neutral-900 dark:text-gray-300 dark:shadow-neutral-950">
      <div className="flex gap-16">
        <Link
          href="/"
          className="flex cursor-pointer items-end gap-2 text-xl font-bold hover:text-gray-100"
        >
          <BookOpen />
          <div>Learn Sign</div>
        </Link>
        <div className="flex items-center gap-10 text-xl">
          <Link
            href="/dictionary"
            className="cursor-pointer hover:text-gray-100"
          >
            Từ Điển
          </Link>
          <Link
            href="/class/dashboard"
            className="cursor-pointer hover:text-gray-100"
          >
            Lớp học
          </Link>
        </div>
      </div>
      {sessionData ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="hover:cursor-pointer">
              <AvatarImage src={sessionData?.user.image ?? ""} />
              <AvatarFallback>
                {sessionData?.user.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <SettingsIcon />
              <div>Cài đặt</div>
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2"
              onClick={() => signOut()}
            >
              <LogOutIcon />
              <div>Đăng xuất</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div
          className="font-bold hover:cursor-pointer"
          onClick={() => signIn("google")}
        >
          Sign in
        </div>
      )}
    </div>
  );
};
