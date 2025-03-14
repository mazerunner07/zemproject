import { AnalyticsProps } from "@/actions/analytics"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@react-email/components"
import Link from "next/link"


export default function OverviewCard({item}:{item : AnalyticsProps}) {
  const Icon = item.icon
  return (
    <div className="grid gap-4">
      <Card className="bg-[#F8FAFB] dark:bg-[#1E293B]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-[#111111] dark:text-[#Ffffff] font-medium">{item.title}</CardTitle>
          <Icon
            className="h-4 w-4 text-[#000000] dark:text-[#Ffffff]"
          >
          </Icon>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-[#111111] dark:text-[#Ffffff] font-bold">{item.isCurrency && <span></span>}{" "}{item.isCurrency ? item.total.toLocaleString() : item.total.toString().padStart(2,"0")}</div>
          <Link
                          href={item.href}
                          className="w-full sm:w-auto bg-[#01B1F3] dark:bg-[#007BFF] dark:hover:bg-[#3B82F6] text-white px-4 py-2 mt-8 rounded-md hover:bg-blue-600 transition-colors text-center grid"
                        >
                          View
                        </Link>
        </CardContent>
      </Card>
    </div>
  )
}