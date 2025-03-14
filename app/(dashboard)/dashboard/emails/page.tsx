import { getUserClient } from "@/actions/clients";
import { getUserSubscribers } from "@/actions/subscribe";
import EmailCompose from "@/components/dashboard/EmailCompose";
import { getAuthUser } from "@/config/useAuth";


export default async function page() {
    const user = await getAuthUser()
    const clients = await getUserClient(user?.id??"")||[]
    const subscribers = await getUserSubscribers(user?.id??"")||[]
  return (
    <div className="bg-slate-100 flex p-6 dark:bg-[#0F172A] items-center justify-center">
      <EmailCompose clients = {clients} subscribers = {subscribers} />
    </div>
  )
}

