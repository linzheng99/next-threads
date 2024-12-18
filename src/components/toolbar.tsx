"use client"

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { type Id } from "@/convex/_generated/dataModel";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";


const Toolbar = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useState(false)
  const { data: workspace } = useGetWorkspace({ id: workspaceId })
  const { data: channels } = useGetChannels({ workspaceId })
  const { data: members } = useGetMembers({ workspaceId })

  const handleSelectChannel = (id: Id<"channels">) => {
    setOpen(false)
    router.push(`/workspace/${workspaceId}/channel/${id}`)
  }

  const handleSelectMember = (id: Id<"users">) => {
    setOpen(false)
    router.push(`/workspace/${workspaceId}/member/${id}`)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button size="sm" variant="ghost" className="bg-accent/25 hover:bg-accent/25 w-full justify-start" onClick={() => setOpen(true)}>
          <Search className="mr-2 size-4 text-white" />
          <span className="text-white text-xs">Search in {workspace?.name}</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
            <span className="text-xs">⌘ + </span>K
          </kbd>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button size="iconSm" variant="transparent">
          <Info className="size-4 text-white" />
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle className="p-3">Search</DialogTitle>
        </VisuallyHidden>
        <CommandInput placeholder="Search channels and members" />
        <CommandList>
          <CommandEmpty>
            No results found.
          </CommandEmpty>
          {
            channels?.length && (
              <>
                <CommandGroup heading="Channels">
                  {channels?.map(({ name, _id }) => {
                    return (
                      <CommandItem key={_id} onSelect={() => handleSelectChannel(_id)}>
                        <span>{name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )
          }
          {
            members?.length && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Members">
                  {members?.map(({ user: { name, _id } }) => {
                    return (
                      <CommandItem key={_id} onSelect={() => handleSelectMember(_id)}>
                        <span>{name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )
          }
        </CommandList>
      </CommandDialog>
    </nav>
  )
}

export default Toolbar;
