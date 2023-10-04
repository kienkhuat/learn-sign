import { useState } from "react";
import WordDetailDialog from "./WordDetailDialog";
import { api } from "~/utils/api";

type PrivateProps = {
  wordList:
    | {
        id: string;
        word: string;
        videoLink: string;
        thumbnailLink: string;
        definition: string;
      }[]
    | undefined;
  _refetch: Function;
  isLoading: boolean;
};

export default function WordList(props: PrivateProps) {
  const [openWordDialog, setOpenWordDialog] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");

  const videosToRender = props.wordList?.map((word, index) => {
    return (
      <div
        key={index}
        className="flex h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg shadow-md shadow-neutral-950 dark:bg-neutral-900"
        onClick={() => {
          setOpenWordDialog(true);
          setSelectedWord(word.id);
        }}
      >
        <div className="h-full w-full overflow-hidden rounded-t-lg">
          <img
            className="h-full w-full rounded-t-lg object-cover transition-all duration-500 hover:scale-110"
            src={`${word.thumbnailLink}`}
          />
        </div>
        <div className="my-2 text-xl dark:text-neutral-300">{word.word}</div>
      </div>
    );
  });
  return (
    <>
      <div className="grid max-h-[calc(100%-80px)] gap-5 overflow-x-hidden overflow-y-scroll px-4 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 2xl:pr-0">
        {videosToRender}
      </div>
      <WordDetailDialog
        isOpen={openWordDialog}
        _setIsOpen={setOpenWordDialog}
        selectedWord={selectedWord}
        _refetch={props._refetch}
      />
    </>
  );
}
