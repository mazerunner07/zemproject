"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Mail, Trash2 } from "lucide-react";
import { Subscriber } from "@prisma/client";
import { deleteSubscriber } from "@/actions/subscribe";
import toast from "react-hot-toast";
import { timeAgo } from "@/lib/timeAgo";

export default function Subscribers({ subscribers }: { subscribers: Subscriber[] }) {
  const list = subscribers.map((item) => ({
    username: item.email.split("@")[0],
    email: item.email,
    id: item.id,
    createdAt: item.createdAt,
  }));

  async function handleDelete(id: string) {
    try {
      const res = await deleteSubscriber(id);
      if (res?.ok) {
        toast.success("Subscriber Deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete subscriber.");
    }
  }

  return (
    <Card className="p-4 max-w-4xl">
      <CardHeader>
        <CardTitle>Mail Subscriber</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-sm text-gray-400 mb-4">Your Subscribers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>When</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <div className="flex-col">

                  {item.username}
                  </div>
                  <div className="text-sm  text-gray-500">

                  {item.email}
                  </div>
                  </TableCell>
                <TableCell className="text-sm text-gray-500">{timeAgo(item.createdAt.toString())}</TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button className="flex items-center gap-2">
                    <Mail /> Send Mail
                  </Button>
                  <Button onClick={() => handleDelete(item.id)} variant="outline" className="w-10 flex items-center justify-center">
                    <Trash2 className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
