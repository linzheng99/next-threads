
import { MdOutlineAddReaction } from "react-icons/md";

import EmojiPopover from "@/components/emoji-popover";
import Hint from "@/components/hint";
import { type Doc, type Id } from "@/convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

interface ReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  onChange: (value: string) => void
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId()
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const currentMemberId = currentMember?._id

  if (data.length === 0 || !currentMemberId) return null

  function handleEmojiSelect(emoji: string) {
    onChange(emoji)
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint key={reaction.value} label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}>
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              'flex items-center gap-1 h-6 px-2 rounded-full border border-transparent hover:border-muted-foreground bg-slate-200/70 text-slate-800',
              reaction.memberIds.includes(currentMemberId) && 'bg-blue-100/70 border-blue-500'
            )}
          >
            {reaction.value}
            <span className={cn(
              'text-xs font-semibold text-muted-foreground',
              reaction.memberIds.includes(currentMemberId) && 'text-blue-500'
            )}>{reaction.count}</span>
          </button>
        </Hint>
      ))}
      <EmojiPopover hint="Add a reaction" align="end" onEmojiSelect={handleEmojiSelect}>
        <button className="flex items-center gap-1 h-6 px-2 rounded-full border border-transparent hover:border-slate-500 bg-slate-200/70 text-slate-800">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
}

export default Reactions;
