import { getUserClient } from "@/actions/clients";
import { getUserSubscribers } from "@/actions/subscribe";
import EmailCompose from "@/components/dashboard/EmailCompose";
import { getAuthUser } from "@/config/useAuth";


export default async function page() {
    const user = await getAuthUser()
    const clients = await getUserClient(user?.id??"")||[]
    const subscribers = await getUserSubscribers(user?.id??"")||[]
  return (
    <div className="min-h-screen bg-slate-100 flex dark:bg-[#121212] items-center justify-center p-4">
      <EmailCompose clients = {clients} subscribers = {subscribers} />
    </div>
  )
}

