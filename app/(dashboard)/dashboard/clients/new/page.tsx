import ClientsForm from "@/components/Forms/ClientsForm";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  return (
    <div className="p-8">
      <ClientsForm userId={userId}/>
    </div>
  );
}
