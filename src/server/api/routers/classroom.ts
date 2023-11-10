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
        name: z.string().min(1, { message: "Class name is empty" }).max(100, {
          message: "Class name must be less than 100 characters.",
        }),
        teacherId: z.string(),
        coverImage: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundUser = await findUser({
        db: ctx.db,
        input: { id: input.teacherId },
      });
      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }
      if (foundUser.role === "teacher" || foundUser.role === "admin") {
        return ctx.db.classroom.create({ data: { ...input } });
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be a teacher or an admin",
        });
      }
    }),

  findClassroom: protectedProcedure
    .input(
      z.object({
        classId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.classroom.findUnique({
        where: { id: input.classId },
        include: { students: true, teacher: true, assignments: true },
      });
    }),

  findTeacherClassrooms: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        searchInput: z.string() || "",
      }),
    )
    .query(async ({ ctx, input }) => {
      const foundUser = await findUser({
        db: ctx.db,
        input: { id: input.userId },
      });
      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }
      if (foundUser.role !== "admin" && foundUser.role !== "teacher") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be a teacher or admin",
        });
      }
      if (!input.searchInput) {
        return ctx.db.classroom.findMany({
          where: {
            teacherId: input.userId,
          },
          include: {
            teacher: true,
          },
        });
      }
      return ctx.db.classroom.findMany({
        where: {
          teacherId: input.userId,
          name: {
            contains: input.searchInput,
            mode: "insensitive",
          },
        },
        include: {
          teacher: true,
        },
      });
    }),

  findStudentClassrooms: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        searchInput: z.string() || "",
      }),
    )
    .query(async ({ ctx, input }) => {
      const foundUser = await findUser({
        db: ctx.db,
        input: { id: input.userId },
      });
      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }
      if (!input.searchInput) {
        return ctx.db.classroom.findMany({
          where: {
            id: {
              in: [...foundUser.classrooms.map((classroom) => classroom.id)],
            },
          },
          include: {
            teacher: true,
          },
        });
      }
      return ctx.db.classroom.findMany({
        where: {
          id: {
            in: [...foundUser.classrooms.map((classroom) => classroom.id)],
          },
          name: {
            contains: input.searchInput,
          },
        },
        include: {
          teacher: true,
        },
      });
    }),

  findAllClassrooms: protectedProcedure
    .input(
      z.object({
        searchInput: z.string() || "",
      }),
    )
    .query(({ ctx, input }) => {
      if (!input.searchInput) {
        return ctx.db.classroom.findMany({
          include: {
            teacher: true,
          },
        });
      }
      return ctx.db.classroom.findMany({
        where: {
          name: {
            contains: input.searchInput,
            mode: "insensitive",
          },
        },
        include: {
          teacher: true,
        },
      });
    }),

  addStudentToClass: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        classroomData: z.object({
          id: z.string(),
          teacherId: z.string(),
        }),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundUser = await findUser({
        db: ctx.db,
        input: { id: input.userId },
      });

      if (!foundUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be logged in",
        });
      }

      if (foundUser.id !== input.classroomData.teacherId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be the classroom's teacher to add",
        });
      }

      const updatedClassroom = await ctx.db.classroom.update({
        where: {
          id: input.classroomData.id,
        },
        data: {
          //can use .map to add multiple
          students: {
            connect: {
              id: input.studentId,
            },
          },
        },
        include: {
          students: true,
        },
      });
      return {
        updatedClassroom,
      };
    }),

  removeStudentFromClass: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        classroomId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundClassroom = await ctx.db.classroom.findUnique({
        where: { id: input.classroomId },
        include: { students: true, teacher: true },
      });

      if (!foundClassroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found",
        });
      }

      const foundUser = await findUser({
        db: ctx.db,
        input: { id: input.userId },
      });

      if (!foundUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be logged in",
        });
      }

      if (foundUser.id !== foundClassroom.teacherId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be the classroom's teacher to add",
        });
      }

      const updatedClassroom = await ctx.db.classroom.update({
        where: {
          id: input.classroomId,
        },
        data: {
          students: {
            disconnect: {
              id: input.studentId,
            },
          },
        },
        include: {
          students: true,
        },
      });
      return {
        updatedClassroom,
      };
    }),

  deleteClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.classroom.delete({
        where: {
          id: input.classroomId,
        },
      });
    }),

  editClassName: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        newClassName: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (!input.newClassName) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Class name to edit cant be empty",
        });
      }
      return ctx.db.classroom.update({
        where: {
          id: input.classroomId,
        },
        data: {
          name: input.newClassName,
        },
      });
    }),
});
