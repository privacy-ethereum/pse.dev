import { cn } from "@/lib/utils"

interface LabelProps {
  label: React.ReactNode
  className?: string
  size?: "small" | "large"
}

const SectionTitle = ({ label, className = "" }: LabelProps) => {
  return (
    <span
      className={cn(
        "font-sans text-base font-bold uppercase leading-[24px] tracking-[3.36px] text-primary",
        className
      )}
    >
      {label}
    </span>
  )
}

const MainPageTitle = ({
  label,
  className = "",
  size = "small",
}: LabelProps) => {
  return (
    <h1
      className={cn(
        "text-4xl font-bold break-words font-display text-primary dark:text-white",
        size === "small" ? "lg:text-5xl" : "lg:text-6xl xl:text-7xl",
        className
      )}
    >
      {label}
    </h1>
  )
}

const Label = {
  displayName: "Label",
  PageTitle: MainPageTitle,
  Section: SectionTitle,
}

export { Label }
