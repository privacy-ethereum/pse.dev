import { CategoryTag } from "@/components/ui/categoryTag"

const VARIANT_MAP = {
  active: "blue" as const,
  rd: "blue" as const,
  research: "gray" as const,
  planned: "gray" as const,
  production: "blue" as const,
  ecosystem: "blue" as const,
  maintenance: "gray" as const,
}

interface StatusBadgeProps {
  label: string
  variant: keyof typeof VARIANT_MAP
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <CategoryTag variant={VARIANT_MAP[variant]}>
      {label}
    </CategoryTag>
  )
}
