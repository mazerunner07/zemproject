import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function Page({ searchParams }: PageProps) {
  const returnUrl = searchParams?.returnUrl
    ? String(searchParams.returnUrl)
    : "/dashboard";

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



