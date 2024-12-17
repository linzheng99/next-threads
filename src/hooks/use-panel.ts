import { type Id } from '@/convex/_generated/dataModel';
import { useParentMessageId } from '@/features/messages/store/use-parent-message-id';

const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()

  const onClose = async () => {
    await setParentMessageId(null)
  }

  const onOpenMessage = async (messageId: Id<'messages'>) => {
    await setParentMessageId(messageId)
  }

  return {
    parentMessageId,
    setParentMessageId,
    onClose,
    onOpenMessage
  }
}

export default usePanel;
