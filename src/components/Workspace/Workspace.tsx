import { Edit2Icon, PlayIcon, PlusSquare, Power, TrashIcon } from "lucide-react"
import { IWorkspace } from "../../../types"
import {
  createItem,
  deleteWorkspace,
  executeAllItems,
  stopAllItems,
  updateItem,
  updateWorkspace,
} from "../../store/workspaceStore"
import { RunableItem } from "../RunableItem/RunableItem"
import { openTempInputModal } from "../TempInputModal/TempInputModal"
import s from "./Workspace.module.scss"
import { openItemModal } from "../ItemModal/ItemModal"

interface IProps {
  workspace: IWorkspace
}

export const Workspace = ({ workspace }: IProps) => {
  const totalItems = workspace.items.length
  const activeItems = workspace.items.filter(i => i.isRunned).length
  const isAllItemsRunned = workspace.items.every(i => i.isRunned)

  const procentageOfRunnedItems = (activeItems / totalItems) * 100

  return (
    <div className={s.workspace} key={workspace.id}>
      <div
        className={s.title}
        style={{ display: "flex", gap: 12, alignItems: "center" }}
      >
        <div className={s.title__text}>{workspace.name}</div>
        <button
          onClick={() => {
            openTempInputModal({
              onSubmit: v => {
                updateWorkspace({
                  id: workspace.id,
                  name: v,
                })
              },
              value: workspace.name,
            })
          }}
        >
          <Edit2Icon size={12} />
        </button>
        <button onClick={() => deleteWorkspace(workspace.id)}>
          <TrashIcon size={12} color="rgb(247, 85, 85)" />
        </button>
        {isAllItemsRunned ? (
          <button
            onClick={() => {
              stopAllItems(workspace.id)
            }}
            style={{ marginLeft: "auto" }}
          >
            <Power size={16} color="rgb(247, 85, 85)" />
            Stop all
          </button>
        ) : (
          <button
            onClick={() => {
              executeAllItems(workspace.id)
            }}
            style={{ marginLeft: "auto" }}
          >
            <PlayIcon size={16} color="green" />
            Run all
          </button>
        )}
      </div>
      {totalItems > 0 && (
        <div className={s.barContainer}>
          <div className={s.barText}>
            {activeItems} / {totalItems}
          </div>
          <div className={s.barWrapper}>
            <div
              className={s.bar}
              style={{
                width: `${procentageOfRunnedItems}%`,
              }}
            ></div>
          </div>
        </div>
      )}
      <div className={s.items} key={workspace.id}>
        {workspace.items.map(i => (
          <RunableItem
            key={i.id}
            item={i}
            onEdit={() => {
              openItemModal({
                onSubmit: v => {
                  updateItem({
                    id: i.id,
                    ...v,
                  })
                },
                value: {
                  command: i.command,
                  name: i.name,
                },
              })
            }}
          />
        ))}
      </div>
      <button
        onClick={() => {
          openItemModal({
            onSubmit: v => {
              createItem({
                id: Date.now(),
                command: v.command,
                isRunned: false,
                workspace: workspace.id,
                isError: false,
                name: v.name,
                pid: null,
              })
            },
            value: {},
          })
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
        }}
      >
        <PlusSquare size={20} />
        Create command
      </button>
    </div>
  )
}
