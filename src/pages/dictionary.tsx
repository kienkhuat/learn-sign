import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import DictionarySideMenu from "~/components/dictionary/DictionarySideMenu";
import { Header } from "~/components/Header";
import WordList from "~/components/dictionary/WordList";
import WordToolbar from "~/components/dictionary/WordToolbar";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [darkMode, setDarkmode] = useState(true);

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
        <title>Learn Sign - Từ Điển</title>
        <meta name="description" content="Learn sign app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="h-full dark:bg-neutral-800">
          <Header />
          <div className="flex h-[calc(100%-64px)]">
            {/* <DictionarySideMenu /> */}
            <div className="w-full">
              <WordToolbar />
              <WordList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
