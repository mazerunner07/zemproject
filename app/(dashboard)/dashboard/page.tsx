import OverviewCard from "@/components/dashboard/overview/OverViewCard";
import RecentClients from "@/components/dashboard/overview/RecentClient";
import RecentProject from "@/components/dashboard/overview/RecentProject";
import { getUserRecentProject } from "@/actions/projects";
import { getAuthUser } from "@/config/useAuth";
import { getUserRecentClient } from "@/actions/clients";
import { getDashboardOverview } from "@/actions/analytics";
import { Card, CardContent } from "@/components/ui/card";

export default async function Dashboard() {
  const user = await getAuthUser();
  const recentProjects = (await getUserRecentProject(user?.id)) ?? [];
  const recentClients = (await getUserRecentClient(user?.id)) || [];
  const analytics = await getDashboardOverview(user?.id) || [];

  return (
    
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analytics.map((item, i) => (
          <OverviewCard item={item} key={i} />
        ))}
      </div>

      {/* Recent Clients and Projects in single row on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="w-full lg:max-h-[800px] overflow-y-auto">
          <RecentProject recentProjects={recentProjects} />
        </div>
        <div className="w-full lg:max-h-[800px] overflow-y-auto">
          <RecentClients recentClients={recentClients} />
        </div>
      </div>
    </main>
    
  );
}