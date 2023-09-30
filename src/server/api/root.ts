import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { dictionaryRouter } from "./routers/dictionary";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  dictionary: dictionaryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
