import { createEvent, createStore } from "effector"
import { ReactNode } from "react"

export const $elementsStore = createStore<ElementsStoreItem[]>([])

export const addElement = createEvent<ElementsStoreItem>()
export const deleteElementById = createEvent<number>()

type ElementsStoreItem = {
  id: number
  element: ReactNode
}

$elementsStore
  .on(addElement, (s, p) => [...s, p])
  .on(deleteElementById, (s, id) => s.filter(item => item.id !== id))

export const addElementWithCleanup = (element: ReactNode) => {
  const id = $elementsStore.getState().length - 1

  addElement({
    id,
    element,
  })

  return () => {
    deleteElementById(id)
  }
}
