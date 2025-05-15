
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000 // 5 seconds

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  timeRemaining?: number
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  UPDATE_TOAST_TIMER: "UPDATE_TOAST_TIMER",
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
  | {
      type: ActionType["UPDATE_TOAST_TIMER"]
      toastId: string
      timeRemaining: number
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const toastTimerIntervals = new Map<string, ReturnType<typeof setInterval>>()

// Store time remaining for each toast
const timeRemainingMap: Record<string, number> = {}

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Set initial time remaining with one decimal for smoother animation
  const initialTimeRemaining = Math.ceil(TOAST_REMOVE_DELAY / 1000);
  timeRemainingMap[toastId] = initialTimeRemaining;
  
  // Create a timer that updates more frequently (4 times per second) for smoother animation
  const timerInterval = setInterval(() => {
    // Update with 0.25 second precision for smoother countdown
    const remaining = Math.max(0, timeRemainingMap[toastId] - 0.25);
    timeRemainingMap[toastId] = remaining;
    
    dispatch({
      type: "UPDATE_TOAST_TIMER",
      toastId,
      timeRemaining: Math.ceil(remaining) // Round up for display
    });
    
    if (remaining <= 0) {
      clearInterval(timerInterval);
    }
  }, 250); // Update 4 times per second for smoother animation
  
  toastTimerIntervals.set(toastId, timerInterval);

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    toastTimerIntervals.delete(toastId)
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
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
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
            : t
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
    case "UPDATE_TOAST_TIMER":
      return {
        ...state,
        toasts: state.toasts.map((t) => 
          t.id === action.toastId 
            ? { ...t, timeRemaining: action.timeRemaining } 
            : t
        ),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  
  // Update timeRemaining tracker when needed
  if (action.type === "ADD_TOAST" && action.toast.id) {
    timeRemainingMap[action.toast.id] = Math.ceil(TOAST_REMOVE_DELAY / 1000);
  } else if (action.type === "REMOVE_TOAST" && action.toastId) {
    delete timeRemainingMap[action.toastId];
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
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
      timeRemaining: Math.ceil(TOAST_REMOVE_DELAY / 1000),
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

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
