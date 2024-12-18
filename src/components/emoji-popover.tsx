import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmojiPopoverProps {
  children: React.ReactNode
  hint?: string
  align?: 'start' | 'end' | 'center'
  onEmojiSelect: (emoji: string) => void
}

const EmojiPopover = ({ children, hint, align = 'center', onEmojiSelect }: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const onSelect = (value: EmojiClickData) => {
    onEmojiSelect(value.emoji)
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
        <PopoverContent className="p-0 h-full border-none shadow-none" align={align}>
          <EmojiPicker
            onEmojiClick={(emoji) => onSelect(emoji)}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

export default EmojiPopover;
