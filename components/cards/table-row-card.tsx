import { Card } from "./card"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
interface TableRowCardProps {
  className?: string
  items: {
    title: ReactNode
    items: string[]
  }[]
}

export const TableRowCard = ({ items, className }: TableRowCardProps) => {
  return (
    <Card
      className={cn("divide-y divide-tuatara-300 w-fit mr-5", className)}
      padding="none"
      variant="transparent"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 divide-tuatara-300 md:grid-cols-[1fr_2.5fr] md:divide-x"
        >
          <div className="flex h-[96px] items-center justify-center border-b border-tuatara-300 bg-anakiwa-100 p-2 text-center md:border-none dark:bg-anakiwa-800">
            <span className="max-w-[136px] text-xs font-bold uppercase tracking-[2.5px] text-primary">
              {item.title}
            </span>
          </div>
          <div className="flex items-center py-2 pr-5">
            <ul className="ml-10 list-disc">
              {item.items.map((label, index) => {
                return <li key={index}>{label}</li>
              })}
            </ul>
          </div>
        </div>
      ))}
    </Card>
  )
}
