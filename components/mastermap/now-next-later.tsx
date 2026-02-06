import { cn } from "@/lib/utils"
import type { RoadmapItem } from "./mastermap-data"

const STATUS_DOT_COLORS = {
  green: "bg-emerald-500",
  yellow: "bg-amber-400",
  gray: "bg-tuatara-300 dark:bg-tuatara-500",
  blue: "bg-blue-500",
} as const

function RoadmapItemCard({ item }: { item: RoadmapItem }) {
  return (
    <div className="pb-4 mb-4 border-b border-tuatara-100 dark:border-tuatara-700 last:border-b-0 last:mb-0 last:pb-0">
      <h4 className="font-sans text-sm font-bold text-tuatara-950 dark:text-white mb-1">
        {item.name}
      </h4>
      <p className="font-sans text-[13px] text-tuatara-500 dark:text-tuatara-300 leading-relaxed mb-1.5">
        {item.description}
      </p>
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            STATUS_DOT_COLORS[item.statusDot]
          )}
        />
        <span className="font-sans text-[11px] text-tuatara-400 dark:text-tuatara-500">
          {item.status}
        </span>
      </div>
    </div>
  )
}

interface NowNextLaterProps {
  now: RoadmapItem[]
  next: RoadmapItem[]
  later: RoadmapItem[]
}

export function NowNextLater({ now, next, later }: NowNextLaterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 rounded-lg overflow-hidden border border-tuatara-100 dark:border-tuatara-700">
      {/* Now */}
      <div className="bg-white dark:bg-tuatara-800">
        <div className="bg-tuatara-950 dark:bg-tuatara-700 px-5 py-3 text-center">
          <span className="font-sans text-base font-bold text-white">Now</span>
        </div>
        <div className="p-5">
          {now.length > 0 ? (
            now.map((item, i) => <RoadmapItemCard key={i} item={item} />)
          ) : (
            <p className="font-sans text-sm text-tuatara-400 italic">
              No items
            </p>
          )}
        </div>
      </div>

      {/* Next */}
      <div className="bg-white dark:bg-tuatara-800 border-t md:border-t-0 md:border-l border-tuatara-100 dark:border-tuatara-700">
        <div className="bg-tuatara-700 dark:bg-tuatara-600 px-5 py-3 text-center">
          <span className="font-sans text-base font-bold text-white">Next</span>
        </div>
        <div className="p-5">
          {next.length > 0 ? (
            next.map((item, i) => <RoadmapItemCard key={i} item={item} />)
          ) : (
            <p className="font-sans text-sm text-tuatara-400 italic">
              No items
            </p>
          )}
        </div>
      </div>

      {/* Later */}
      <div className="bg-white dark:bg-tuatara-800 border-t md:border-t-0 md:border-l border-tuatara-100 dark:border-tuatara-700">
        <div className="bg-tuatara-400 dark:bg-tuatara-500 px-5 py-3 text-center">
          <span className="font-sans text-base font-bold text-white">
            Later
          </span>
        </div>
        <div className="p-5">
          {later.length > 0 ? (
            later.map((item, i) => <RoadmapItemCard key={i} item={item} />)
          ) : (
            <p className="font-sans text-sm text-tuatara-400 italic">
              No items
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
