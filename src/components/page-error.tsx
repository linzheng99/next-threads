import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

interface PageErrorProps {
  message?: string
  className?: string
}

export default function PageError({ message = "Something went wrong", className }: PageErrorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center h-full", className)}>
      <AlertTriangle className="size-6 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
