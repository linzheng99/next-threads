/** eslint-disable @next/next/no-img-element */
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ThumbnailProps {
  url: string | null | undefined
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  const [open, setOpen] = useState(false)
  if (!url) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <DialogTitle className="p-3">image</DialogTitle>
      </VisuallyHidden>
      <DialogTrigger>
        <div className="relative overflow-hidden rounded-lg max-w-[360px] border my-2 cursor-zoom-in">
          <img src={url} alt="message image" className="rounded-md size-full object-cover" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent shadow-none p-0">
        <img src={url} alt="message image" className="rounded-md size-full object-cover" />
      </DialogContent>
    </Dialog>
  );
}

export default Thumbnail;
