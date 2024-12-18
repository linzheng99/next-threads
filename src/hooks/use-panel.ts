import { type Id } from '@/convex/_generated/dataModel';
import { useProfileMemberId } from '@/features/members/store/use-profile-member-id';
import { useParentMessageId } from '@/features/messages/store/use-parent-message-id';

const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()
  const [profileMemberId, setProfileMemberId] = useProfileMemberId()

  const onClose = async () => {
    await setParentMessageId(null)
    await setProfileMemberId(null)
  }

  const onOpenMessage = async (messageId: Id<'messages'>) => {
    await setParentMessageId(messageId)
    await setProfileMemberId(null)
  }

  const onOpenProfile = async (memberId: Id<'members'>) => {
    await setProfileMemberId(memberId)
    await setParentMessageId(null)
  }

  return {
    parentMessageId,
    profileMemberId,
    onClose,
    onOpenMessage,
    onOpenProfile
  }
}

export default usePanel;
