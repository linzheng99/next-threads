import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { useState } from "react";

import PreferencesModal from "@/components/preferences-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Doc } from "@/convex/_generated/dataModel";
import InviteModal from "@/features/workspaces/components/invite-modal";

import Hint from "./hint";
import { Button } from "./ui/button";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">
  isAdmin: boolean
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  return (
    <>
      <InviteModal
        name={workspace.name}
        joinCode={workspace.joinCode}
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
      <PreferencesModal isOpen={preferencesOpen} onClose={() => setPreferencesOpen(false)} initialValue={workspace.name} />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="transparent" size="sm" className="flex items-center text-lg w-auto p-1.5 overflow-hidden">
              <span className="truncate">
                {workspace?.name}
              </span>
              <ChevronDown className="size-4 shrink-0 ml01" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem>
              <div className="size-9 rounded-md text-lg bg-[#616061] text-white relative overflow-hidden flex items-center justify-center cursor-pointer">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="truncate font-bold">
                  {workspace.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>
            {
              isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setInviteModalOpen(true)}>
                    <p className="truncate cursor-pointer py-2">
                      Invite people to {workspace.name}
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPreferencesOpen(true)}>
                    <p className="truncate cursor-pointer py-2">
                      Preferences
                    </p>
                  </DropdownMenuItem>
                </>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New Message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
}

export default WorkspaceHeader;
