import MemberAvatar from "@/components/member-avatar";

interface MemberHeroProps {
  name?: string
  image?: string
}

const MemberHero = ({ name = 'Member', image }: MemberHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4 space-y-2">
      <MemberAvatar name={name} image={image} className="size-12" />
      <p className="text-2xl font-bold flex items-center mb-2">
        {name}
      </p>
      <p className="font-normal text-slate-800 mb-4">
        This is the very beginning of this <strong>{name}</strong> conversation.
      </p>
    </div>
   );
}

export default MemberHero;
