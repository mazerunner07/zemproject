import { getClientsById } from "@/actions/clients";
import { getUserById } from "@/actions/users";
import ClientsForm from "@/components/Forms/ClientsForm";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const client = await getUserById(id);

  const transformedClient = client
    ? {
        ...client,
        password: client.password ?? undefined,
        image: client.image ?? undefined, 
        emailVerified: client.emailVerified ?? undefined,
        country: client.country ?? undefined,
        location: client.location ?? undefined,
      }
    : null;

  return (
    <div className="p-8">
      <ClientsForm initialData={transformedClient} editingId={id} />
    </div>
  );
}
