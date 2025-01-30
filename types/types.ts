import { ProjectStatus, UserRole } from "@prisma/client";

export type CategoryProps = {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
};
export interface UserProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  name?: string;
  phone?: string;
  image?: string;
  userId?: string;
  role?: UserRole;
  country?: string;
  location?: string;
  companyName?: string;
  companyDescription?: string;
}
export type LoginProps = {
  email: string;
  password: string;
};

export type ProjectProps = {
  name: string;
  slug: string;
  notes: string;
  description: string;
  bannerImage: string;
  thumbnail: string;
  startDate: any;
  endDate: any;
  status: ProjectStatus;
  clientId: string;
  userId: string;
  budget: number;
  deadline: number;
};

export type ProjectData = {
  id:string;
  name:string;
  slug:string;
  notes:string | null;
  description: string | null;
  bannerImage: string | null;
  thumbnail: string | null;
  budget: number | null;
  deadline: number | null
  startDate: Date | null
  endDate: Date | null;
  status: ProjectStatus
  clientId: string
  userId: string
  modules: Module[]
  comments: ProjectComment[]
  members: Member[]
  invoices: Invoice[]
  payments: Payment[]
  createdAt: Date
  updatedAt: Date
  client: ClientData
}

export type Module = {
  id: string
  name: string
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export type ProjectComment = {
  id: string
  content: string
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export type Member = {
  id:string
  name: string
  email: string
  role: string
  projectId:  string
  createdAt: Date
  updatedAt: Date
}

export type Invoice = {
  id: string
  invoiceNumber: string
  amount: number;
  status: string
  dueDate: Date
  projectId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type Payment = {
  id:string
  amount: number
  date: Date
  method: string
  projectId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type ClientData = {
  id:string
  name: string
  firstName: string
  lastName: string
  phone: string
  email: string
  image: string | null
  country: string | null
  location: string | null
  role: UserRole
  companyName: string | null
  companyDescription: string | null
}
