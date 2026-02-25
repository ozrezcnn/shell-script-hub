import { createEvent, createStore, merge } from "effector"

interface IState {
  background?: string
}

const initialState: IState = JSON.parse(
  localStorage.getItem("customization") || "{}"
)

export const $customizationStore = createStore<IState>(initialState)

export const updateCustomization = createEvent<Partial<IState>>()

const save = merge([updateCustomization])

$customizationStore.on(updateCustomization, (s, p) => {
  return {
    ...s,
    ...p,
  }
})

$customizationStore.on(save, s => {
  localStorage.setItem("customization", JSON.stringify(s))

  return s
})
