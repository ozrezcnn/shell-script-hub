import { Edit, PlayIcon, Power, TrashIcon } from "lucide-react"
import { deleteItem, executeItem, stopItem } from "../../store/workspaceStore"
import s from "./RunableItem.module.scss"
import { IWorkspaceItem } from "../../../types"

interface IProps {
  onEdit: () => void
  item: IWorkspaceItem
}

export const RunableItem = ({ item, onEdit }: IProps) => {
  const hStop = async () => {
    stopItem(item.id)
  }

  const hRun = async () => {
    executeItem(item.id)
  }

  const getStatusColor = () => {
    if (item.isError) {
      return "red"
    }

    if (item.isRunned) {
      return "green"
    }

    return "yellow"
  }

  const hDelete = () => {
    deleteItem(item.id)
  }

  return (
    <div className={s.root}>
      <div className={s.status} style={{ background: getStatusColor() }}></div>
      <div className={s.text}>{item.name}</div>
      <div className={s.btns}>
        <button onClick={hDelete}>
          <TrashIcon size={16} color="rgb(247, 85, 85)" />
        </button>
        <button onClick={onEdit}>
          <Edit size={16} />
        </button>
        {item.isRunned ? (
          <button onClick={hStop}>
            <Power size={16} color="rgb(247, 85, 85)" />
          </button>
        ) : (
          <button onClick={hRun}>
            <PlayIcon size={16} color="green" />
          </button>
        )}
      </div>
    </div>
  )
}
