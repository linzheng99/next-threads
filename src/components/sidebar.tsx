"use client";

import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

import UserButton from "@/features/auth/components/user-button";
import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher";

import SideButton from "./sideButton";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-[#481349] h-full w-[70px] flex flex-col items-center p-5 gap-y-4">
      <WorkspaceSwitcher />
      <SideButton icon={Home} label="Home" isActive={pathname.includes('/workspace')} />
      <SideButton icon={MessageSquare} label="DMs" />
      <SideButton icon={Bell} label="Activity" />
      <SideButton icon={MoreHorizontal} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  )
}

export default Sidebar;
