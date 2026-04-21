import { cva } from "class-variance-authority"

interface CircleSkeletonProps {
  size?: "sm" | "full"
  className?: string
}

interface CardSkeletonProps {
  size?: "sm" | "md" | "lg"
  rounded?: "sm" | "md" | "lg"
  className?: string
}

interface LineSkeletonProps {
  size?: "sm" | "md" | "lg" | "xs" | "xl"
  className?: string
}

const CardSkeleton = cva("bg-skeleton animate-pulse", {
  variants: {
    size: {
      sm: "w-full h-40",
      md: "w-full h-60",
      lg: "w-full h-80",
    },
    rounded: {
      lg: "rounded-lg",
      md: "rounded-md",
      sm: "rounded-sm",
    },
  },
})

const CircleSkeleton = cva("bg-skeleton animate-pulse rounded-full", {
  variants: {
    size: {
      sm: "w-10 h-10",
      full: "w-full aspect-square",
    },
  },
})

const LineSkeleton = cva("bg-skeleton animate-pulse", {
  variants: {
    size: {
      sm: "w-full h-4",
      lg: "w-full h-8",
      md: "w-full h-6",
      xs: "w-full h-3",
      xl: "w-full h-12",
    },
  },
})

export const Skeleton = {
  displayName: "Skeleton",
  Line: ({ size = undefined, className }: LineSkeletonProps) => (
    <div className={LineSkeleton({ size, className })}></div>
  ),
  Circle: ({ size = undefined, className }: CircleSkeletonProps) => (
    <div className={CircleSkeleton({ size, className })}></div>
  ),
  Card: ({
    size = undefined,
    rounded = undefined,
    className,
  }: CardSkeletonProps) => (
    <div className={CardSkeleton({ size, rounded, className })}></div>
  ),
}
