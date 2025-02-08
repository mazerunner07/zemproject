import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@prisma/client";
import { getInitials } from "@/lib/generateInitials";

interface RecentClientsProps {
  recentClients?: User[];
}

export default function RecentClients({ recentClients = [] }: RecentClientsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center flex-nowrap gap-4 overflow-x-auto pb-4">
          {recentClients.length > 0 ? (
            recentClients.map((client) => (
              <div
                key={client.id}
                className="flex-none flex items-center bg-white p-4 rounded-lg shadow-sm sm:min-w-[500px] w-full sm:w-auto justify-between"
              >
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src="/avatars/01.png" alt={client.name || "Avatar"} />
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-8 font-medium text-sm">{client.location ?? "Unknown"}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent clients found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}