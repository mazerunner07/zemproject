import LoginForm from "@/components/Forms/LoginForm";
import { authOptions } from "@/config/auth";
import { Lock, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const returnUrl = (searchParams?.returnUrl as string) || "/dashboard";
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(returnUrl);
  }

  return (
    <section>
      <LoginForm />
    </section>
  );
}
