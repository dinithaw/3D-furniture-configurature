"use client"

// Inspired by react-hot-toast library
import type * as React from "react"
import { useState } from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toastInner({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

type ToastVariant = "default" | "destructive"

interface ToastPropsUpdated {
  title: string
  description: string
  variant?: ToastVariant
}

function useToast() {
  const [toasts, setToasts] = useState<ToastPropsUpdated[]>([])

  const toast = ({ title, description, variant = "default" }: ToastPropsUpdated) => {
    // In a real implementation, this would use a proper toast library
    // For this demo, we'll just log to console
    console.log(`[${variant.toUpperCase()}] ${title}: ${description}`)

    // Create a temporary element to show the toast
    const toastElement = document.createElement("div")
    toastElement.className = `p-4 mb-2 rounded-md shadow-md transition-all transform translate-y-0 opacity-100 ${
      variant === "destructive"
        ? "bg-red-100 border-l-4 border-red-500 text-red-700"
        : "bg-green-100 border-l-4 border-green-500 text-green-700"
    }`

    const titleElement = document.createElement("h3")
    titleElement.className = "font-medium"
    titleElement.textContent = title

    const descElement = document.createElement("p")
    descElement.className = "text-sm"
    descElement.textContent = description

    toastElement.appendChild(titleElement)
    toastElement.appendChild(descElement)

    const container = document.getElementById("toast-container")
    if (container) {
      container.appendChild(toastElement)

      // Animate and remove after 3 seconds
      setTimeout(() => {
        toastElement.style.opacity = "0"
        toastElement.style.transform = "translateY(10px)"
        setTimeout(() => {
          if (container.contains(toastElement)) {
            container.removeChild(toastElement)
          }
        }, 300)
      }, 3000)
    }
  }

  return { toast, toastInner }
}

export { useToast, toastInner as toast }
