export type classroomDataType = {
  students: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
  }[];
  teacher: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
  };
} & {
  name: string;
  id: string;
  createdAt: Date;
  coverImage: string;
};
