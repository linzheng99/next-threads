import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string
}

export default function PageLoader({ className }: PageLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center h-screen", className)}>
      <Loader className="text-sm text-neutral-500 animate-spin" />
    </div>
  )
}
