"use client";


import PageLoader from "@/components/page-loader";
import Sidebar from "@/components/sidebar";
import Toolbar from "@/components/toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceSidebar from "@/components/workspace-sidebar";
import { type Id } from "@/convex/_generated/dataModel";
import Profile from "@/features/members/components/profile";
import Thread from "@/features/messages/components/thread";
import usePanel from "@/hooks/use-panel";

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  const { parentMessageId, onClose, profileMemberId } = usePanel()

  const showPanel = !!parentMessageId || !!profileMemberId

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="threads-workspace-layout">
          <ResizablePanel defaultSize={20} minSize={11} className="bg-[#5e2c5f]">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={80}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {
                  parentMessageId ? (
                    <Thread
                      messageId={parentMessageId as Id<'messages'>}
                      onClose={onClose}
                    />
                  ) : profileMemberId ? (
                    <Profile
                      memberId={profileMemberId as Id<'members'>}
                      onClose={onClose}
                    />
                  ) : (
                    <PageLoader />
                  )
                }
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceLayout;
