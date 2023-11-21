import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const resourceRouter = createTRPCRouter({
  findResources: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        searchInput: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.resources.findMany({
        where: {
          classroomId: input.classroomId,
          name: {
            contains: input.searchInput,
            mode: "insensitive",
          },
        },
        include: {
          classroom: true,
        },
      });
    }),

  createResource: protectedProcedure
    .input(
      z.object({
        resourceShare: z.string(),
        classroomId: z.string(),
        contents: z
          .object({
            id: z.string(),
            type: z.string(),
            value: z.string().optional(),
            attachments: z
              .object({
                key: z.string(),
                name: z.string(),
                url: z.string(),
              })
              .array()
              .optional(),
          })
          .array(),
        imageCover: z.object({
          key: z.string(),
          name: z.string(),
          url: z.string(),
        }),
        name: z.string(),
        description: z.string().optional(),
        attachments: z
          .object({
            key: z.string(),
            name: z.string(),
            url: z.string(),
          })
          .array()
          .optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.resources.create({
        data: {
          classroomId: input.classroomId,
          name: input.name,
          imageCover: input.imageCover,
          contents: input.contents,
          description: input.description,
          attachments: input.attachments,
          resourceShare: input.resourceShare,
        },
      });
    }),

  deleteResource: protectedProcedure
    .input(
      z.object({
        resourceId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.resources.delete({
        where: {
          id: input.resourceId,
        },
      });
    }),
});
