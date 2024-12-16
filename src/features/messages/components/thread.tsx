import { X } from "lucide-react";
import { useState } from "react";

import Message from "@/components/message";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { type Id } from "@/convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetMessage } from "../api/use-get-message";

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => Promise<void>
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId()
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)

  const { data: message, isLoading: isMessageLoading } = useGetMessage({ id: messageId })
  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId })

  if (isMessageLoading || isCurrentMemberLoading) return <PageLoader />
  if (!message) return <PageError message="Message not found" />

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b h-[49px]">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <X className="size-4 stroke-[1.5]" />
        </Button>
      </div>
      <Message
        id={message._id}
        memberId={message.memberId}
        authorName={message.user.name}
        authorImage={message.user.image}
        isAuthor={currentMember?._id === message.memberId}
        reactions={message.reactions}
        body={message.body}
        image={message.image}
        updatedAt={message.updatedAt}
        createdAt={message._creationTime}
        isEditing={editingId === message._id}
        setIdEditing={setEditingId}
        hideTreadButton={true}
      />
    </div>
  );
}

export default Thread;
