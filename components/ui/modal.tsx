"use client"

import React, { ReactNode } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Icons } from "../icons"

interface ModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  children?: ReactNode
  footer?: ReactNode
  size?: "lg" | "md" | "xl"
  className?: string
}

interface ModalWrapperProps {
  children?: ReactNode
  className?: string
}

const ModalContent = ({ children, className = "" }: ModalWrapperProps) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

const modalContentVariants = cva(
  "data-[state=open]:animate-content-show flex flex-col bg-white dark:bg-black rounded-b-none rounded-t-lg md:rounded-lg shadow-sm top-3 bottom-0 fixed md:-translate-y-1/2 md:-translate-x-1/2 md:top-1/2 md:left-1/2 md:h-full md:max-h-[80vh] focus:outline-none z-50 dark:border dark:border-anakiwa-800",
  {
    variants: {
      size: {
        md: "w-full max-w-2xl",
        lg: "w-full max-w-3xl",
        xl: "w-full max-w-4xl",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
)

const Modal = ({
  title,
  children,
  footer,
  size,
  open,
  setOpen,
  className = "",
}: ModalProps) => (
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black opacity-80 data-[state=open]:animate-overlay-show dark:bg-anakiwa-950 dark:opacity-90" />
      <Dialog.Content className={cn(modalContentVariants({ size }), className)}>
        {title && (
          <Dialog.Title>
            <ModalContent className="border-b border-b-tuatara-200 text-center dark:border-anakiwa-800">
              {title}
            </ModalContent>
          </Dialog.Title>
        )}

        <ModalContent className="h-full overflow-auto md:h-[100VH]">
          {children}
        </ModalContent>

        {footer && (
          <ModalContent className="mt-auto border-t border-t-tuatara-200 dark:border-anakiwa-800">
            {footer}
          </ModalContent>
        )}

        <Dialog.Close>
          <div
            className="absolute right-4 top-4 inline-flex w-5 cursor-pointer"
            aria-label="Close"
          >
            <Icons.close />
          </div>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

Modal.displayName = "Modal"

export { Modal, modalContentVariants }
