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
        "font-sans text-base font-bold uppercase leading-[24px] tracking-[3.36px] text-tuatara-950",
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
    <span
      className={cn(
        "text-4xl font-bold break-words font-display text-tuatara-950 ",
        size === "small" ? "lg:text-5xl" : "lg:text-6xl xl:text-7xl",
        className
      )}
    >
      {label}
    </span>
  )
}

const Label = {
  displayName: "Label",
  PageTitle: MainPageTitle,
  Section: SectionTitle,
}

export { Label }
