"use client";

import LoginForm from "@/components/Forms/LoginForm";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace(returnUrl);
    }
  }, [session, returnUrl, router]);

  return (
    <section>
      <LoginForm />
    </section>
  );
}
