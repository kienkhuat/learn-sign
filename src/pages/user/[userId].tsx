import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "~/components/Header";
import UserDetailScreen from "~/components/user/UserDetailScreen";

import { api } from "~/utils/api";

export default function Home() {
  const [darkMode, setDarkmode] = useState(true);
  const router = useRouter();

  const { data: sessionData } = useSession();

  const searchParams = useSearchParams();

  const {
    data: userData,
    isLoading,
    refetch,
  } = api.user.findUser.useQuery({
    id: router.isReady ? (router.query.userId as string) : "",
  });

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
        <title>Learn Sign</title>
        <meta name="description" content="Learn sign app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="dark: h-full text-neutral-300 dark:bg-neutral-800">
          <Header />
          <UserDetailScreen userData={userData} _refetch={refetch} />
        </div>
      </main>
    </>
  );
}
