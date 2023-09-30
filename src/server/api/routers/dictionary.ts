import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const dictionaryRouter = createTRPCRouter({
  getAllWord: publicProcedure.query(({ ctx }) => {
    return ctx.db.word.findMany();
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
    .mutation(({ ctx, input }) => {
      console.log(input);
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
