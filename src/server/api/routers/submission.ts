import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const submissionRouter = createTRPCRouter({
  createSubmission: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        studentId: z.string(),
        comment: z.string().optional(),
        attachments: z
          .object({
            key: z.string(),
            name: z.string(),
            url: z.string(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundSubmission = await ctx.db.submission.findMany({
        where: {
          studentId: input.studentId,
          assignmentId: input.assignmentId,
        },
      });
      if (foundSubmission.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Submission already exist for user in that class",
        });
      }
      const createdSubmission = await ctx.db.submission.create({
        data: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
          comment: input.comment,
          attachments: input.attachments,
        },
      });
      return createdSubmission;
    }),

  findUserSubmission: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        assignmentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const foundSubmission = await ctx.db.submission.findMany({
        where: {
          studentId: input.userId,
          assignmentId: input.assignmentId,
        },
        include: {
          assignment: true,
          student: true,
        },
      });
      return foundSubmission;
    }),

  findSubmissionList: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        searchInput: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!input.searchInput) {
        return ctx.db.submission.findMany({
          where: {
            assignmentId: input.assignmentId,
          },
        });
      }
      return ctx.db.submission.findMany({
        where: {
          assignmentId: input.searchInput,
          student: {
            name: {
              contains: input.searchInput,
              mode: "insensitive",
            },
          },
        },
        include: {
          assignment: true,
          student: true,
        },
      });
    }),
});
