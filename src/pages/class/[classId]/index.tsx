import { Loader2Icon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "~/components/Header";
import ClassDetailSideMenu from "~/components/class/ClassDetailSideMenu";
import StudentList from "~/components/class/list/classroom/ClassroomStudentList";
import ClassroomAssignmentScreen from "~/components/class/screen/classroom/ClassroomAssignmentScreen";
import ClassroomChatroomScreen from "~/components/class/screen/classroom/ClassroomChatroomScreen";
import ClassroomResourceScreen from "~/components/class/screen/classroom/ClassroomResourceScreen";
import ClassroomStudentListScreen from "~/components/class/screen/classroom/ClassroomStudentListScreen";

import { api } from "~/utils/api";

export default function Home() {
  const [darkMode, setDarkmode] = useState(true);
  const router = useRouter();

  const { data: sessionData } = useSession();

  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");

  const {
    data: classroomData,
    isLoading,
    refetch,
  } = api.classroom.findClassroom.useQuery({
    classId: router.isReady ? (router.query.classId as string) : "",
  });

  useEffect(() => {
    if (!classroomData || !sessionData) return;
    const studentInClassroom = classroomData.students.find(
      (student) => student.id === sessionData.user.id,
    );
    if (
      !studentInClassroom &&
      classroomData.teacherId !== sessionData.user.id
    ) {
      router.push("/"); //Todo: redirect to request to join
    }
  }, [classroomData, sessionData]);

  useEffect(() => {
    if (!tabParams && router.isReady) {
      router.push(`/class/${router.query.classId}?tab=resources`);
    }
  }, [tabParams, router.isReady]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const renderTabScreen = () => {
    switch (tabParams) {
      case "resources":
        return (
          <ClassroomResourceScreen
            _refetch={refetch}
            isLoading={isLoading}
            classroomData={classroomData!}
          />
        );
      case "students":
        return (
          <ClassroomStudentListScreen
            _refetch={refetch}
            isLoading={isLoading}
            classroomData={classroomData!}
          />
        );
      case "assignments":
        return (
          <ClassroomAssignmentScreen
            _refetchClassroomData={refetch}
            isClassroomDataLoading={isLoading}
            classroomData={classroomData!}
          />
        );
      case "chatroom":
        return (
          <ClassroomChatroomScreen
            _refetch={refetch}
            isLoading={isLoading}
            classroomData={classroomData!}
          />
        );
    }
  };

  return (
    <>
      <Head>
        <title>Learn Sign</title>
        <meta name="description" content="Learn sign app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="dark: h-full text-neutral-300 dark:bg-neutral-800">
          <Header />
          {renderTabScreen()}
        </div>
      </main>
    </>
  );
}
