import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  Assignment: f({
    video: { maxFileSize: "1GB", maxFileCount: 10 },
    image: { maxFileSize: "1GB", maxFileCount: 10 },
    pdf: { maxFileSize: "1GB", maxFileCount: 10 },
    text: { maxFileSize: "1GB", maxFileCount: 10 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      const user = await auth(req, res);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),

  Submission: f({
    video: { maxFileSize: "1GB", maxFileCount: 10 },
    image: { maxFileSize: "1GB", maxFileCount: 10 },
    pdf: { maxFileSize: "1GB", maxFileCount: 10 },
    text: { maxFileSize: "1GB", maxFileCount: 10 },
  })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),

  ResourceAttachment: f({
    video: { maxFileSize: "1GB", maxFileCount: 10 },
    image: { maxFileSize: "1GB", maxFileCount: 10 },
    pdf: { maxFileSize: "1GB", maxFileCount: 10 },
    text: { maxFileSize: "1GB", maxFileCount: 10 },
  })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),

  ResourceImage: f({
    image: { maxFileSize: "1GB", maxFileCount: 1 },
  })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
