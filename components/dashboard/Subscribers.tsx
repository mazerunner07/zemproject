import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Subscriber } from "@prisma/client";

export default function Subscribers({ subscribers }: {subscribers : Subscriber[]}) {
    const list = subscribers.map((item)=>{
        const username = item.email.split("@")[0]
        return{
            username,
            email:item.email
        }
    })
  return (
    <Card className="p-4 max-w-2xl">
      <CardHeader>
        <CardTitle>Mail Subscriber</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-sm text-gray-400 mb-4">Your Subscribers</h2>
        <div className="space-y-4">
          {list.map((item,i) => (
            <div
              key={i}
              className="grid grid-cols-2 items-center border p-3 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-medium">{item.username}</p>
                <p className="text-sm text-gray-500">{item.email}</p>
              </div>
              <Button
                // onClick={() => handleSendMail(subscriber.email)}
                
                className="flex items-center gap-2"
              >
                <Mail size={16} /> Send Mail
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
