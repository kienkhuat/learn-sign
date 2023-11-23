import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

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

  deleteAssignment: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundAssignment = await ctx.db.assignment.findUnique({
        where: {
          id: input.assignmentId,
        },
        include: {
          submissions: true,
        },
      });

      if (!foundAssignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found",
        });
      }

      const imagesToDelete: string[] = [];

      foundAssignment.attachments.map((attachment) => {
        const attachmentAsObject = attachment as {
          key: string;
          name: string;
          url: string;
        };
        imagesToDelete.push(attachmentAsObject.key);
      });

      foundAssignment.submissions.map((submission) => {
        submission.attachments.map((attachment) => {
          const attachmentAsObject = attachment as {
            key: string;
            name: string;
            url: string;
          };
          imagesToDelete.push(attachmentAsObject.key);
        });
      });

      console.log(imagesToDelete);

      if (imagesToDelete.length) {
        await utapi.deleteFiles([...imagesToDelete]);
      }

      return ctx.db.assignment.delete({
        where: {
          id: input.assignmentId,
        },
      });
    }),

  findClassroomAssignments: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        searchInput: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const foundClassroom = ctx.db.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
      });
      if (!foundClassroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found (in assignment)",
        });
      }

      if (!input.searchInput) {
        return ctx.db.assignment.findMany({
          where: {
            classroomId: input.classroomId,
          },
          include: {
            classroom: true,
            submissions: true,
            teacher: true,
          },
        });
      }
      return ctx.db.assignment.findMany({
        where: {
          classroomId: input.classroomId,
          name: {
            contains: input.searchInput,
            mode: "insensitive",
          },
        },
        include: {
          classroom: true,
          submissions: true,
          teacher: true,
        },
      });
    }),
});
