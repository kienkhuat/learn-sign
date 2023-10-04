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
  const [darkMode, setDarkmode] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const {
    data: wordList,
    isLoading,
    refetch,
  } = api.dictionary.getAllWord.useQuery();

  const { data: searchedWordList } = api.dictionary.searchWords.useQuery({
    searchInput: searchInput,
  });

  return (
    <>
      <Head>
        <title>Learn Sign - Từ Điển</title>
        <meta name="description" content="Learn sign app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="h-full dark:bg-neutral-900">
          <Header />
          <div className="flex h-[calc(100%-64px)] justify-center">
            {/* <DictionarySideMenu /> */}
            <div className="w-[100%] dark:bg-neutral-800 xl:w-[90%] 2xl:w-[80%]">
              <WordToolbar
                _refetch={refetch}
                _setSearchInput={setSearchInput}
              />
              <WordList
                wordList={searchInput ? searchedWordList : wordList}
                isLoading={isLoading}
                _refetch={refetch}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
