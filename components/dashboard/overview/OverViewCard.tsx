import { AnalyticsProps } from "@/actions/analytics"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"


export default function OverviewCard({item}:{item : AnalyticsProps}) {
  const Icon = item.icon
  return (
    <div className="grid gap-4">
      <Card className="bg-[#D1F1FD] dark:bg-[#1E293B]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-[#00B1F3] font-medium">{item.title}</CardTitle>
          <Icon
            className="h-4 w-4 text-[#00B1F3]"
          >
          </Icon>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-[#00B1F3] font-bold">{item.isCurrency && <span></span>}{" "}{item.isCurrency ? item.total.toLocaleString() : item.total.toString().padStart(2,"0")}</div>
          <Link href ={item.href} className="text-xs underline text-[#00B1F3]">
            View Details
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}