import { createTRPCRouter } from "~/server/api/trpc";
import { dictionaryRouter } from "./routers/dictionary";
import { classroomRouter } from "./routers/classroom";
import { userRouter } from "./routers/user";
import { assignmentRouter } from "./routers/assignment";
import { submissionRouter } from "./routers/submission";
import { resourceRouter } from "./routers/resource";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dictionary: dictionaryRouter,
  classroom: classroomRouter,
  user: userRouter,
  assignment: assignmentRouter,
  submission: submissionRouter,
  resource: resourceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
