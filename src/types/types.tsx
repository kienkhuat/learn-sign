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

export type assignmentDataListType =
  | ({
      classroom: {
        id: string;
        name: string;
        createdAt: Date;
        teacherId: string;
        coverImage: string;
      };
      teacher: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        role: string;
      };
      submissions: {
        id: string;
        assignmentId: string;
        grade: number | null;
        comment: string | null;
        teacherComment: string | null;
        attachments: Prisma.JsonValue[];
        studentId: string;
        createdAt: Date;
      }[];
    } & {
      id: string;
      name: string;
      task: string;
      classroomId: string;
      createdAt: Date;
      deadline: Date;
      attachments: Prisma.JsonValue[];
      teacherId: string;
    })[]
  | undefined;

export type assignmentDataType = {
  classroom: {
    id: string;
    name: string;
    createdAt: Date;
    teacherId: string;
    coverImage: string;
  };
  teacher: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
  };
  submissions: {
    id: string;
    assignmentId: string;
    grade: number;
    comment: string;
    teacherComment: string;
    attachments: Prisma.JsonValue[];
    studentId: string;
    createdAt: Date;
  }[];
} & {
  id: string;
  name: string;
  task: string;
  classroomId: string;
  createdAt: Date;
  deadline: Date;
  attachments: Prisma.JsonValue[];
  teacherId: string;
};

export type studentSubmissionsType =
  | ({
      assignment: {
        id: string;
        name: string;
        task: string;
        classroomId: string;
        createdAt: Date;
        deadline: Date;
        attachments: Prisma.JsonValue[];
        teacherId: string;
      };
      student: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        role: string;
      };
    } & {
      id: string;
      assignmentId: string;
      grade: number | null;
      comment: string | null;
      teacherComment: string | null;
      attachments: Prisma.JsonValue[];
      studentId: string;
      createdAt: Date;
    })[]
  | undefined;
