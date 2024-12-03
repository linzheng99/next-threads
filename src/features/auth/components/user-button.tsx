"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { Loader2, LogOutIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useCurrentUser } from "../hooks/use-current-user"


export default function UserButton() {
  const { signOut } = useAuthActions()
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) return <Loader2 className="animate-spin size-4 text-muted-foreground" />
  if (!user) return null

  const { image, name} = user

  const avatarFallback = name?.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-10 hover:opacity-80 transition">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center" side="right">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}