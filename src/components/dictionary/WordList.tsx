import { useState } from "react";
import WordDetailDialog from "./WordDetailDialog";

const PLACEHOLDER_WORD = [
  {
    id: 1,
    word: "Địa chỉ (Miền Bắc)",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ (Miền Trung)",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ (Miền Nam)",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 1,
    word: "Địa chỉ",
    thumbnail: "https://qipedc.moet.gov.vn/thumbs/D0001B.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function WordList() {
  const [openWordDialog, setOpenWordDialog] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");

  const videosToRender = PLACEHOLDER_WORD.map((word, index) => {
    return (
      <div
        key={index}
        className="flex h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg dark:bg-neutral-900"
        onClick={() => setOpenWordDialog(true)}
      >
        <div className="h-full w-full overflow-hidden rounded-t-lg">
          <img
            className="h-full w-full rounded-t-lg object-cover transition-all duration-500 hover:scale-110"
            src={`${word.thumbnail}`}
          />
        </div>
        <div className="my-2 text-xl dark:text-neutral-300">{word.word}</div>
      </div>
    );
  });
  return (
    <>
      <div className="grid h-[calc(100%-72px)] gap-5 overflow-x-hidden overflow-y-scroll px-4 pb-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {videosToRender}
      </div>
      <WordDetailDialog
        isOpen={openWordDialog}
        _setIsOpen={setOpenWordDialog}
      />
    </>
  );
}
