import { BookOpenIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "~/components/Header";
import ClassDashboard from "~/components/class/classList/ClassListView";
import ClassSideMenu from "~/components/class/ClassSideMenu";

import { api } from "~/utils/api";

export default function Home() {
  const [darkMode, setDarkmode] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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
          <div className="flex h-[calc(100%-64px)] w-full">
            <ClassSideMenu pathname={router.pathname} />
            {/* <ClassDashboard /> */}
          </div>
        </div>
      </main>
    </>
  );
}
