import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react"

import EmojiPopover from "./emoji-popover"
import Hint from "./hint"
import { Button } from "./ui/button"

interface MessageToolbarProps {
  isAuthor: boolean
  isPending: boolean
  handleEdit: () => void
  handleThread: () => void
  handleDelete: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleReaction: (value: string) => void
  hideTreadButton?: boolean
}

const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideTreadButton,
}: MessageToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md">
        <EmojiPopover hint="Add a reaction" align="end" onEmojiSelect={(emoji) => handleReaction(emoji)}>
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideTreadButton && (
          <Hint label="Reply in thread">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
}

export default MessageToolbar;
