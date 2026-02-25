import { ChangeEvent, useId, useRef } from "react"
import s from "./ChangeBgButton.module.scss"
import { DeleteIcon, Image } from "lucide-react"
import {
  $customizationStore,
  updateCustomization,
} from "../../store/customizationStore"
import { useUnit } from "effector-react"

export const ChangeBgButton = () => {
  const customizationStore = useUnit($customizationStore)
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const hChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]

    const fr = new FileReader()
    fr.readAsDataURL(file)

    fr.onload = ev => {
      updateCustomization({
        background: ev.target!.result as string,
      })
      inputRef.current!.value = ""
    }
  }

  return (
    <div className={s.root}>
      <label htmlFor={id}>
        <input
          onChange={hChange}
          type="file"
          id={id}
          style={{ display: "none" }}
          accept="image/*"
          ref={inputRef}
        />
        <button className={s.btn} onClick={() => inputRef.current!.click()}>
          <Image width={16} height={16} />
        </button>
      </label>
      {customizationStore.background ? (
        <button
          onClick={() =>
            updateCustomization({
              background: undefined,
            })
          }
          className={s.btn}
        >
          <DeleteIcon width={16} height={16} />
        </button>
      ) : null}
    </div>
  )
}
