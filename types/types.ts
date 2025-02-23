import { ProjectStatus, TaskStatus, Payment as IPayment, UserRole, User } from "@prisma/client";
import { Stringifier } from "postcss";
import { Attributes } from "react";

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
  userLogo?: string;
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
  gradient: string;
  thumbnail: string;
  startDate: any;
  endDate: any;
  status: ProjectStatus;
  clientId: string;
  userId: string;
  budget: number;
  deadline: number;
};

export type ModuleData = {
  id:string;
  name:string;
  userName:string;
  userId:string
  projectId:string
  tasks:Module[]
  createdAt:Date;
  updatedAt:Date
}
export type ProjectData = {
  id:string;
  name:string;
  slug:string;
  client: ClientData
  user: User
  notes:string | null;
  description: string | null;
  bannerImage: string | null;
  gradient: string | null;
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
}
export type ProjectWithUser = {
  id:string;
  name:string;
  slug:string;
  user: User
  notes:string | null;
  description: string | null;
  bannerImage: string | null;
  gradient: string | null;
  thumbnail: string | null;
  budget: number | null;
  deadline: number | null
  startDate: Date | null
  endDate: Date | null;
  status: ProjectStatus
  clientId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
export type ProjectWithPayments = {
  id:string;
  name:string;
  slug:string;
  thumbnail: string | null;
  payments: Payment[]
}
export type DetailedUserProjects = ProjectWithPayments[]

export type Module = {
  id: string
  name: string
  projectId: string
  userId: string;
  userName: string;
  createdAt: Date
  updatedAt: Date
  tasks?: TaskProps[];
}


export type ProjectComment = {
  id: string
  content: string
  projectId: string
  userName: string
  userRole: UserRole
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

export type InvoiceDetails = {
  invoice : IPayment
  user : IUser | null
  client : IClient | null
}

interface IUser {
  name : string
  phone : string
  email : string
  companyName : string
  companyDescription : string 
  userLogo : string
}

interface IClient{
  name : string
  phone : string
  email : string
  companyName : string
  companyDescription : string 
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

export type ModuleProps = {
   name : string
   userName : string
   userId : string
   projectId : string
}
export type TaskProps = {
   id?: string
   title : string
   status : TaskStatus
   moduleId : string
}

export type Payment = {
  id:string
  amount: number
  date: Date
  title: string
  method: string
  projectId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  invoiceNumber: string
}
export type PaymentProps={
  amount: number
  tax: number
  date: string
  title: string
  invoiceNumber: string
  method: string
  projectId: string
  userId: string
  clientId : string
}
export type CommentProps={
  content : string
  projectId : string
  userName : string
  userRole : UserRole
  userId :string
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
  plain: string | null
  companyName: string | null
  companyDescription: string | null
}
