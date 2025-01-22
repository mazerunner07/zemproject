import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth";
import { StringToBoolean } from "class-variance-authority/types";

interface AuthUser {
  id: string;
  email: string;
  role:string;
  name?: string;
}
export async function getAuthUser(): Promise<AuthUser | null> {
  const session : Session | null  = await getServerSession(authOptions);
  if(session?.user){
    const {id, email, role, name} = session.user as AuthUser;
  return {
    id,
    role,
    email,
    name
  }
  }
  return null;
}