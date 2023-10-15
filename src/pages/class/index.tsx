import { useSession } from "next-auth/react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "~/components/Header";
import ClassSideMenu from "~/components/class/ClassSideMenu";
import StudentClassList from "~/components/class/classList/StudentClassList";
import TeacherClassList from "~/components/class/classList/TeacherClassList";

export default function Home() {
  const [darkMode, setDarkmode] = useState(true);

  const { data: sessionData } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");

  useEffect(() => {
    if (!tabParams) {
      router.push("/class?tab=dashboard");
    }
  }, [tabParams]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const renderRoleClassList = () => {
    switch (sessionData?.user.role) {
      case "teacher":
        return <TeacherClassList />;
      case "student":
        return <StudentClassList />;
      case "admin":
        return <TeacherClassList />;
    }
  };

  return (
    <>
      <Head>
        <title>Learn Sign - Lớp học</title>
        <meta name="description" content="Learn sign app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="h-full dark:bg-neutral-800">
          <Header />
          {sessionData ? (
            <div className="flex h-[calc(100%-64px)] w-full">
              <ClassSideMenu />
              {renderRoleClassList()}
            </div>
          ) : (
            <div>Need to login</div>
          )}
        </div>
      </main>
    </>
  );
}
