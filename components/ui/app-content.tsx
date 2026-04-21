import React from "react"

interface AppContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export const AppContent = ({ children = null, className }: AppContentProps) => {
  return <div className={`container ${className}`}>{children}</div>
}
