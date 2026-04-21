import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva("flex flex-col rounded-[8px] overflow-hidden", {
  variants: {
    variant: {
      blue: "bg-anakiwa-100 border border-tuatara-300 dark:bg-black dark:border-anakiwa-800",
      transparent: "bg-transparent border border-tuatara-300",
    },
    padding: {
      none: "p-0",
      xs: "p-4",
      sm: "py-8 px-6",
    },
  },
  defaultVariants: {
    variant: "blue",
    padding: "sm",
  },
})

interface ProjectCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = ({ variant, padding, children, className }: ProjectCardProps) => {
  return (
    <div
      className={cn(
        cardVariants({
          variant,
          padding,
          className,
        })
      )}
    >
      {children}
    </div>
  )
}

Card.displayName = "Card"

export { Card }
