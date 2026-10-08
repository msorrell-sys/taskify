// Domain Entity Types (matching Prisma models)

export enum Role {
  ProductManager = 'ProductManager',
  Engineer = 'Engineer',
}

export enum Status {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Done = 'Done',
}

export interface User {
  id: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  assigneeId: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User | null;
  project?: Project;
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  taskId: string;
  createdAt: string;
  author?: User;
  task?: Task;
}
