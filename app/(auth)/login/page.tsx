import LoginForm from "@/components/Forms/LoginForm";
import { authOptions } from "@/config/auth";
import { Lock, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
  searchParams,
}:{
  searchParams : {[key : string] : string | string[]|undefined}
}) {
  const {returnUrl = "/dashboard"} = searchParams
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(returnUrl as string);
  }
  return (
    <section>
      <LoginForm />
    </section>
  );
}
