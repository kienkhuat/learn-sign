import { MenuIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
const PLACEHOLDER_LANGUAGES = [
  {
    id: 1,
    name: "Ký hiệu Miền Nam",
  },
  {
    id: 2,
    name: "Ký hiệu Miền Bắc",
  },
];
export default function DictionarySideMenu() {
  const [selectedLanguage, setSelectedLanguage] = useState(1);

  const renderLanguages = PLACEHOLDER_LANGUAGES.map((language, index) => {
    return (
      <div
        key={language.id}
        onClick={() => setSelectedLanguage(language.id)}
        className={`${
          selectedLanguage === language.id ? "bg-neutral-800" : ""
        } mx-2 cursor-pointer rounded px-4 py-2 transition-all hover:bg-neutral-700 hover:transition-all hover:duration-300`}
      >
        {language.name}
      </div>
    );
  });

  return (
    <div className="flex w-[240px] flex-col dark:bg-neutral-900 dark:text-gray-300">
      <div className="flex items-center justify-between p-2 pl-4">
        <div className="text-lg">Ngôn ngữ</div>
        <Button
          className="dark:bg-neutral-900 dark:text-white dark:hover:bg-white dark:hover:text-black"
          variant="outline"
          size="icon"
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="flex w-full justify-center">
        <div className="w-[90%] border-b border-solid border-neutral-500"></div>
      </div>
      <div className="mt-2 flex flex-col">{renderLanguages}</div>
    </div>
  );
}
