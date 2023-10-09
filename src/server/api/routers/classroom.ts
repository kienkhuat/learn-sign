import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { findUser } from "./user";
import { TRPCError } from "@trpc/server";

export const classroomRouter = createTRPCRouter({
  createClassroom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        teacherId: z.string(),
        coverImage: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundUser = await findUser({
        db: ctx.db,
        input: { id: input.teacherId },
      });
      if (foundUser?.role === "teacher" || foundUser?.role === "admin") {
        return ctx.db.classroom.create({ data: { ...input } });
      } else {
        console.log("Create Classroom Error");
        console.log({ input, foundUser });
      }
    }),
});
