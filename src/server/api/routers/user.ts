import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  findAllUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  findUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input: { id }, ctx }) => {
      const foundUser = await findUser({ db: ctx.db, input: { id } });
      return foundUser;
    }),
});

const findUserInputSchema = z.object({
  id: z.string(),
});
type findUserInput = z.infer<typeof findUserInputSchema>;

export async function findUser({
  db,
  input,
}: {
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  input: findUserInput;
}) {
  return db.user.findUnique({
    where: { id: input.id },
  });
}
