"use client"

import { Info, Search } from "lucide-react";

import { Button } from "./ui/button";

const Toolbar = () => {
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button size="sm" variant="ghost" className="bg-accent/25 hover:bg-accent/25 w-full justify-start">
          <Search className="mr-2 size-4 text-white" />
          <span className="text-white text-xs">Search</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button size="iconSm" variant="transparent">
          <Info className="size-4 text-white" />
        </Button>
      </div>
    </nav>
  )
}

export default Toolbar;
