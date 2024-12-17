import { formatDistanceToNow } from "date-fns"
import { ChevronRightIcon } from "lucide-react"

import MemberAvatar from "./member-avatar"

interface ThreadBarProps {
  count?: number
  image?: string
  timestamp?: number
  name?: string
  onClick?: () => void
}

const ThreadBar = ({
  count,
  image,
  timestamp,
  name = 'Member',
  onClick
}: ThreadBarProps) => {
  if (!count || !timestamp) return null

  return (
    <button className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/hover-thread-bar transition max-w-[600px]" onClick={onClick}>
      <div className="flex items-center gap-2">
        <MemberAvatar name={name} image={image} className="size-8" />
        <span className="text-xs text-sky-600 hover:underline font-bold truncate">
          {count} {count > 1 ? 'replies' : 'reply'}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/hover-thread-bar:hidden block">
          Last reply about {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/hover-thread-bar:block hidden">
          View thread
        </span>
        <ChevronRightIcon className="size-4 text-muted-foreground group-hover/hover-thread-bar:opacity-100 opacity-0" />
      </div>
    </button>
  );
}

export default ThreadBar;
