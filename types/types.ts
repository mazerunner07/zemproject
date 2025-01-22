import { UserRole } from "@prisma/client";

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
  status: string;
  clientId: string;
  userId: string;
  budget: number;
  deadline: number;
};
