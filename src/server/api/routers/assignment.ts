import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  createAssignment: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        task: z.string(),
        classroomId: z.string(),
        deadline: z.date(),
        attachments: z
          .object({
            key: z.string(),
            name: z.string(),
            url: z.string(),
          })
          .array(),
        teacherId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const foundTeacher = ctx.db.user.findUnique({
        where: {
          id: input.teacherId,
        },
      });
      if (!foundTeacher) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be a teacher",
        });
      }

      const foundClassroom = ctx.db.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
      });
      if (!foundClassroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found",
        });
      }
      return ctx.db.assignment.create({
        data: {
          name: input.name,
          task: input.task,
          classroomId: input.classroomId,
          deadline: input.deadline,
          attachments: input.attachments,
          teacherId: input.teacherId,
        },
      });
    }),
});
