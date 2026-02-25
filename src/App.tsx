import s from "./App.module.scss"
import { useUnit } from "effector-react"
import { $workspaceStore, createWorkspace } from "./store/workspaceStore"
import { Workspace } from "./components/Workspace/Workspace"
import { $elementsStore } from "./store/elementsStore"
import { openTempInputModal } from "./components/TempInputModal/TempInputModal"
import { FolderPlus } from "lucide-react"
import { Background } from "./components/Background/Background"
import { ChangeBgButton } from "./components/ChangeBgButton/ChangeBgButton"

function App() {
  const workspaceStore = useUnit($workspaceStore)
  const elementStore = useUnit($elementsStore)

  // updateCustomization
  return (
    <>
      <ChangeBgButton />
      <Background />
      {elementStore.map(e => e.element)}
      <div className={s.root}>
        {workspaceStore.map(w => (
          <Workspace key={w.id} workspace={w} />
        ))}
        <button
          onClick={() => {
            openTempInputModal({
              onSubmit: v => {
                createWorkspace({
                  id: Date.now(),
                  items: [],
                  name: v,
                })
              },
              value: "",
            })
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: "center",
          }}
        >
          <FolderPlus size={16} />
          Create folder
        </button>
      </div>
    </>
  )
}

export default App
