import { InputHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "w-full rounded-md bg-zinc-50",
    "text-anakiwa-950 placeholder-anakiwa-950",
    "border-[1.5px] border-tuatara-200",
    "transition-colors duration-100 animate",
    "focus:ring-0",
    "focus-visible:border-2 focus-visible:border-tuatara-950",
    "focus-visible:ring-0 focus-visible:none focus-visible:outline-none",
    "dark:bg-transparent dark:border dark:border-anakiwa-800 dark:text-anakiwa-300 dark:placeholder-anakiwa-300",
  ].join(" "),
  {
    variants: {
      size: {
        default: "text-sm py-2 px-4",
        sm: "text-xs py-2 px-4",
        lg: "text-lg py-3 px-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface InputProps
  extends VariantProps<typeof inputVariants>,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id" | "children"> {
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  onIconClick?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      className,
      icon: Icon,
      iconPosition = "left",
      onIconClick,
      ...props
    },
    ref
  ) => {
    if (!Icon) {
      return (
        <input
          ref={ref}
          {...props}
          className={cn(inputVariants({ size, className }))}
        />
      )
    }

    return (
      <div className={cn("relative w-full", className)}>
        <input
          ref={ref}
          {...props}
          className={cn(
            inputVariants({ size, className }),
            iconPosition === "left" ? "pl-10" : "pr-10"
          )}
        />
        {onIconClick ? (
          <button
            onClick={onIconClick}
            className={cn(
              "flex items-center justify-center absolute top-1/2 -translate-y-1/2 text-anakiwa-950 dark:text-anakiwa-300 size-4",
              iconPosition === "left" ? "left-3" : "right-3"
            )}
          >
            <Icon size={16} />
          </button>
        ) : (
          <Icon
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-anakiwa-950 dark:text-anakiwa-300 size-4",
              iconPosition === "left" ? "left-3" : "right-3"
            )}
          />
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
