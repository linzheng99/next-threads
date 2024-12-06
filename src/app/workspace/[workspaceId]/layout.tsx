"use client";

import Sidebar from "@/components/sidebar";
import Toolbar from "@/components/toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceSidebar from "@/components/workspace-sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
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
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceLayout;
