import MessageList from "@/components/message-list";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { type Id } from "@/convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import MemberHeader from "@/features/members/components/header";
import MemberInput from "@/features/members/components/member-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";

interface MemberConversationClientProps {
  id: Id<"conversations">
}

const MemberConversationClient = ({ id }: MemberConversationClientProps) => {
  const memberId = useMemberId()

  const { data: member, isLoading: isMemberLoading } = useGetMember({ id: memberId })
  const { results, status, loadMore } = useGetMessages({ conversationId: id })

  if (isMemberLoading || status === 'LoadingFirstPage') {
    return <PageLoader />
  }

  if (!member) {
    return <PageError message="member not found" />
  }

  console.log(member)

  return (
    <div className="h-full flex flex-col">
      <MemberHeader
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => { }}
      />
      <MessageList
        variant="conversation"
        memberName={member.user.name}
        memberImage={member.user.image}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <MemberInput
        placeholder={`Message ${member.user.name}`}
        conversationId={id}
      />
    </div>
  );
}

export default MemberConversationClient;
