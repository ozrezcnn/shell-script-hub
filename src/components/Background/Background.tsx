import { useUnit } from "effector-react"
import s from "./Background.module.scss"
import { $customizationStore } from "../../store/customizationStore"

export const Background = () => {
  const customization = useUnit($customizationStore)

  if (!customization.background) return null

  return (
    <div
      className={s.root}
      style={{ backgroundImage: `url(${customization.background})` }}
    ></div>
  )
}
