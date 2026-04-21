import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"
import * as React from "react"

const buttonVariants = cva(
  "font-sans inline-flex items-center justify-center gap-2 duration-200 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background w-fit",
  {
    variants: {
      variant: {
        default: "bg-tuatara-950 text-white hover:bg-tuatara-950/90",
        orange: "bg-orangeDark text-white hover:bg-orangeDark/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-anakiwa-400 text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        black: "bg-tuatara-950 text-white hover:bg-black",
        white: "bg-zinc-50 text-black hover:bg-zinc-100",
        blue: "bg-anakiwa-950 text-white",
        search:
          "bg-[#F6F7F7] hover:bg-[#E9ECEF] text-gray-500 border border-gray-200 rounded-md",
        transparent:
          "bg-transparent text-white border text-anakiwa-400 border-anakiwa-400 border",
      },
      size: {
        default: "h-10 py-2 px-4 text-lg",
        xs: "h-[18px] px-2 rounded-md text-xs py-[2px]",
        sm: "h-9 px-3 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md text-lg",
      },
    },
    compoundVariants: [
      {
        variant: [
          "default",
          "orange",
          "black",
          "white",
          "blue",
          "search",
          "transparent",
        ],
        className:
          "dark:bg-transparent dark:border dark:border-anakiwa-400 dark:text-anakiwa-400 dark:hover:bg-anakiwa-400/20 dark:hover:text-anakiwa-400",
      },
      {
        variant: ["secondary"],
        className: "dark:bg-anakiwa-400 dark:text-black",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: LucideIcon
  accessibleName?: string
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      icon,
      accessibleName,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const Icon = icon

    // Generate accessible name from children text if not provided
    const getAccessibleName = () => {
      if (accessibleName) return accessibleName
      if (typeof children === "string") return children
      // If children is complex, try to extract text content
      if (React.isValidElement(children)) {
        // For simple elements, try to get text content
        const textContent = React.Children.toArray(children)
          .map((child) => {
            if (typeof child === "string") return child
            if (
              React.isValidElement(child) &&
              typeof child.props.children === "string"
            ) {
              return child.props.children
            }
            return ""
          })
          .join(" ")
          .trim()
        return textContent || undefined
      }
      return undefined
    }

    const accessibleNameValue = getAccessibleName()

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={accessibleNameValue}
        {...props}
      >
        {Icon && iconPosition === "left" && <Icon size={18} />}
        <span>{children}</span>
        {Icon && iconPosition === "right" && <Icon size={18} />}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
