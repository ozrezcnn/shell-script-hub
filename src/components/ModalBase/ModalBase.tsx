import s from "./ModalBase.module.scss"
import { ReactNode } from "react"

interface IProps {
  isOpen: boolean
  children: ReactNode
}

export const ModalBase = ({ isOpen, children }: IProps) => {
  return (
    isOpen && (
      <div className={s.root}>
        <div className={s.inner}>{children}</div>
      </div>
    )
  )
}
