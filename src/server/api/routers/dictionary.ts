import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

export const dictionaryRouter = createTRPCRouter({
  getAllWord: publicProcedure.query(({ ctx }) => {
    return ctx.db.word.findMany({
      orderBy: {
        word: "asc",
      },
    });
  }),

  findWord: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input: { id }, ctx }) => {
      return ctx.db.word.findUnique({
        where: { id },
      });
    }),

  searchWords: publicProcedure
    .input(
      z.object({
        searchInput: z.string(),
      }),
    )
    .query(({ input: { searchInput }, ctx }) => {
      return ctx.db.word.findMany({
        where: {
          word: {
            contains: searchInput,
            mode: "insensitive",
          },
        },
        orderBy: {
          word: "asc",
        },
      });
    }),

  createNewWord: protectedProcedure
    .input(
      z.object({
        word: z.string(),
        videoLink: z.string(),
        thumbnailLink: z.string(),
        definition: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const uploadedVideo = await utapi.uploadFilesFromUrl(input.videoLink);
      // const uploadedThumbnail = await utapi.uploadFilesFromUrl(
      //   input.thumbnailLink,
      // );
      // console.log({ uploadedThumbnail, uploadedVideo });

      return ctx.db.word.create({ data: { ...input } });
    }),

  deleteWord: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.word.delete({
        where: { id },
      });
    }),
});
