import { useSession } from "next-auth/react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "~/components/Header";
import ClassSideMenu from "~/components/class/ClassSideMenu";
import StudentClassList from "~/components/class/list/StudentClassList";
import TeacherClassList from "~/components/class/list/TeacherClassList";
import ClassDashboardScreen from "~/components/class/screen/ClassDashboardScreen";
import ClassListScreen from "~/components/class/screen/ClassListScreen";
import ClassStudentScreen from "~/components/class/screen/ClassStudentScreen";

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

  const renderTabScreen = () => {
    switch (tabParams) {
      case "dashboard":
        return <ClassDashboardScreen />;
      case "classrooms":
        return <ClassListScreen />;
      case "user":
        return <ClassStudentScreen />;
      case "chat":
        return <ClassListScreen />;
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
          {renderTabScreen()}
        </div>
      </main>
    </>
  );
}
