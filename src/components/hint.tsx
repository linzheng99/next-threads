import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HintProps {
  label: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "end" | "center"
}

const Hint = ({
  label,
  children,
  side = "top",
  align = "center",
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="bg-black text-white border border-white/10">
          <p className="font-medium text-sm">
            {label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
 
export default Hint;
