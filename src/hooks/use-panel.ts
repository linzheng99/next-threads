import { useParentMessageId } from '@/features/messages/store/use-parent-message-id';

const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()

  const onClose = async () => {
    await setParentMessageId(null)
  }

  return {
    parentMessageId,
    setParentMessageId,
    onClose
  }
}

export default usePanel;
