import { FormEvent, useState } from "react"
import s from "./TempInputModal.module.scss"
import { addElementWithCleanup } from "../../store/elementsStore"
import { ModalBase } from "../ModalBase/ModalBase"

interface IProps {
  value: string
  onSubmit: (v: string) => void
}

export const TempInputModal = ({ value, onSubmit }: IProps) => {
  const [v, setV] = useState(value)

  const hSubmit = (e: FormEvent) => {
    e.preventDefault()
    // @ts-ignore
    onSubmit(new FormData(e.target).get("input"))
  }
  return (
    <ModalBase isOpen>
      <form className={s.form} onSubmit={hSubmit}>
        <textarea
          name="input"
          onChange={e => setV(e.target.value)}
          value={v}
          rows={10}
          cols={50}
        />
        <button>submit</button>
      </form>
    </ModalBase>
  )
}

export const openTempInputModal = (props: IProps) => {
  const clear = addElementWithCleanup(
    <TempInputModal
      {...props}
      onSubmit={v => {
        props.onSubmit(v)
        clear()
      }}
    />
  )

  return {
    close: clear,
  }
}
