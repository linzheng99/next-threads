
import { PlusIcon } from "lucide-react"
import { FaCaretDown } from "react-icons/fa"
import { useToggle } from 'react-use'

import Hint from "@/components/hint"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WorkspaceSectionProps {
  children: React.ReactNode
  label: string
  hint: string
  onNew?: () => void
}

const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true)

  return (
    <div className="flex flex-col px-2 mt-3">
      <div className="flex items-center px-3.5 group">
        <Button variant="transparent" className="text-sm text-[#f9edffcc] p-0.5 size-6 shrink-0" onClick={toggle}>
          <FaCaretDown className={cn("size-4 transition-transform", on && "-rotate-90")} />
        </Button>
        <Button variant="transparent" size="sm" className="group text-sm text-[#f9edffcc] px-1.5 h-[28px] shrink-0 overflow-hidden">
          <span className="truncate">{label}</span>
        </Button>
        {
          onNew && (
            <Hint label={hint}>
              <Button variant="transparent" size="iconSm" className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5" onClick={onNew}>
                <PlusIcon className="size-5" />
              </Button>
            </Hint>
          )
        }
      </div>
      {on && children}
    </div>
  );
}

export default WorkspaceSection;
