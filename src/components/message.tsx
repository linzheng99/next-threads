
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { type Doc, type Id } from "@/convex/_generated/dataModel";
import { useRemoveMessage } from "@/features/message/api/use-remove-message";
import { useUpdateMessage } from "@/features/message/api/use-update-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reactions";
import Reactions from "@/features/reactions/components/reactions";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

import Hint from "./hint";
import MemberAvatar from "./member-avatar";
import MessageToolbar from "./message-toolbar";
import Thumbnail from "./thumbnail";


const Renderer = dynamic(() => import('./renderer'), { ssr: false })
const Editor = dynamic(() => import('./editor'), { ssr: false })

interface MessageProps {
  id: Id<"messages">
  memberId: Id<"members">
  authorName?: string
  authorImage?: string
  isAuthor: boolean
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  body: Doc<'messages'>['body']
  image: string | null | undefined
  createdAt: Doc<'messages'>['_creationTime']
  updatedAt: Doc<'messages'>['updatedAt']
  isEditing: boolean
  setIdEditing: (id: Id<'messages'> | null) => void
  isCompact?: boolean
  hideTreadButton?: boolean
  threadCount?: number
  threadImage?: string | null | undefined
  threadTimestamp?: number
}

function formatFullTime(date: Date) {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMMM d, yyyy')} at ${format(date, 'HH:mm:ss')}`
}

const Message = ({
  id,
  memberId,
  authorName = 'Member',
  authorImage,
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setIdEditing,
  isCompact = false,
  hideTreadButton = false,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this message?',
    'This action cannot be undone.'
  )
  const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage()
  const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage()
  const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction()

  const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction

  async function handleUpdateMessage({ body }: { body: string }) {
    await updateMessage({ id, body }, {
      onSuccess: () => {
        toast.success('Message updated')
        setIdEditing(null)
      },
      onError: () => {
        toast.error('Failed to update message')
      }
    })
  }

  async function handleRemoveMessage() {
    const ok = await confirm()
    if (!ok) return

    await removeMessage({ id }, {
      onSuccess: () => {
        toast.success('Message deleted')
      },
      onError: () => {
        toast.error('Failed to delete message')
      }
    })
  }

  async function handleToggleReaction(value: string) {
    console.log('handleToggleReaction', value)
    await toggleReaction({ messageId: id, value }, {
      onSuccess: () => {
        toast.success('Reaction toggled')
      },
      onError: () => {
        toast.error('Failed to toggle reaction')
      }
    })
  }

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 duration-200'
        )}>
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), 'HH:mm')}
              </button>
            </Hint>
            {
              isEditing ? (
                <div className="w-full h-full">
                  <Editor
                    onSubmit={handleUpdateMessage}
                    disabled={isPending}
                    defaultValue={JSON.parse(body)}
                    onCancel={() => setIdEditing(null)}
                    variant="update"
                  />
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <Renderer value={body} />
                  <Thumbnail url={image} />
                  {updatedAt ? (<span className="text-xs text-muted-foreground">(edited)</span>) : null}
                  <Reactions data={reactions} onChange={handleToggleReaction} />
                </div>
              )
            }
          </div>
          {
            !isEditing && (
              <MessageToolbar
                isAuthor={isAuthor}
                isPending={isPending}
                handleEdit={() => setIdEditing(id)}
                handleThread={() => { }}
                handleDelete={handleRemoveMessage}
                handleReaction={handleToggleReaction}
                hideTreadButton={hideTreadButton}
              />
            )
          }
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 duration-200'
        )}>
        <div className="flex items-start gap-2">
          <MemberAvatar name={authorName} image={authorImage} className="size-10" fallbackClassName="text-lg" />
          {
            isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdateMessage}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setIdEditing(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full overflow-hidden">
                <div className="text-sm">
                  <button className="text-sm font-semibold hover:underline">{authorName}</button>
                  <span>&nbsp;·&nbsp;</span>
                  <Hint label={formatFullTime(new Date(createdAt))}>
                    <button className="text-xs text-muted-foreground hover:underline">
                      {format(new Date(createdAt), 'HH:mm')}
                    </button>
                  </Hint>
                </div>
                <div className="flex flex-col w-full">
                  <Renderer value={body} />
                  <Thumbnail url={image} />
                  {updatedAt ? (<span className="text-xs text-muted-foreground">(edited)</span>) : null}
                  <Reactions data={reactions} onChange={handleToggleReaction} />
                </div>
              </div>
            )
          }
        </div>
        {
          !isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setIdEditing(id)}
              handleThread={() => { }}
              handleDelete={handleRemoveMessage}
              handleReaction={handleToggleReaction}
              hideTreadButton={hideTreadButton}
            />
          )
        }
      </div>
    </>
  );
}

export default Message;
