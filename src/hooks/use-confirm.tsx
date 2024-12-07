import { useState } from "react"

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function useConfirm(
  title: string,
  message: string,
  variant: ButtonProps['variant'] = 'default'
): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

  function confirm() {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }

  function handleClose() {
    setPromise(null)
  }

  function handleConfirm() {
    promise?.resolve(true)
    handleClose()
  }

  function handleCancel() {
    promise?.resolve(false)
    handleClose()
  }


  const ConfirmationDialog = () => {
    return (
      <Dialog
        open={promise !== null}
        onOpenChange={() => handleClose()}
      >
        <DialogContent className="border-none" >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <span className="text-sm text-neutral-400">
              {message}
            </span>
          </DialogDescription>
          <DialogFooter className="flex flex-col w-full gap-4 lg:flex-row justify-end" >
            <Button variant="outline" onClick={() => handleCancel()}>
              Cancel
            </Button>
            <Button variant={variant} onClick={() => handleConfirm()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [ConfirmationDialog, confirm]
}
