import { Prisma } from "@prisma/client";

export type classroomDataType = {
  teacher: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
  };
  students: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
  }[];
  assignments: {
    id: string;
    name: string;
    task: string;
    classroomId: string;
    createdAt: Date;
    deadline: Date;
    attachments: Prisma.JsonValue[];
    teacherId: string;
  }[];
} & {
  id: string;
  name: string;
  createdAt: Date;
  teacherId: string;
  coverImage: string;
};
