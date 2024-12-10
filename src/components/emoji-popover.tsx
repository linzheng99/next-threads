import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmojiPopoverProps {
  children: React.ReactNode
  hint?: string
  onEmojiSelect: (emoji: string) => void
}

const EmojiPopover = ({ children, hint, onEmojiSelect }: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const onSelect = (emoji: string) => {
    onEmojiSelect(emoji)
    setPopoverOpen(false)

    setTimeout(() => {
      setTooltipOpen(false)
    }, 250)
  }

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 h-full border-none shadow-none">
          <Picker
            onEmojiSelect={onSelect}
            data={data}
            theme="light"
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

export default EmojiPopover;
