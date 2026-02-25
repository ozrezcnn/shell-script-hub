import s from "./ItemModal.module.scss"
import { ModalBase } from "../ModalBase/ModalBase"
import { addElementWithCleanup } from "../../store/elementsStore"
import { FormEvent } from "react"

interface IProps {
  value: {
    name?: string
    command?: string
  }
  onSubmit: (v: { name: string; command: string }) => void
}

export const ItemModal = ({ onSubmit, value }: IProps) => {
  const hSubmit = (e: FormEvent) => {
    e.preventDefault()

    onSubmit({
      name: new FormData(e.target as any).get("name") as string,
      command: new FormData(e.target as any).get("command") as string,
    })
  }

  return (
    <ModalBase isOpen>
      <form className={s.form} onSubmit={hSubmit}>
        <input defaultValue={value.name} name="name" placeholder="name" />
        <textarea
          defaultValue={value.command}
          name="command"
          rows={10}
          cols={50}
        />
        <button>submit</button>
      </form>
    </ModalBase>
  )
}

export const openItemModal = (props: IProps) => {
  const clear = addElementWithCleanup(
    <ItemModal
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
