import { createEvent, createStore, merge, sample } from "effector"
import { IWorkspace, IWorkspaceItem } from "../../types"
import { spawn } from "node:child_process"
import treeKill from "tree-kill"

export const $workspaceStore = createStore<IWorkspace[]>(
  localStorage.getItem("workspaceStore")
    ? JSON.parse(localStorage.getItem("workspaceStore")!)
    : []
)

export const createWorkspace = createEvent<IWorkspace>()
export const updateWorkspace = createEvent<Pick<IWorkspace, "id" | "name">>()
export const deleteWorkspace = createEvent<number>()
export const createItem = createEvent<IWorkspaceItem & { workspace: number }>()
export const updateItem = createEvent<
  {
    id: number
  } & Partial<IWorkspaceItem>
>()
export const deleteItem = createEvent<number>()

export const executeAllItems = (id: number) => {
  const workspaces = $workspaceStore.getState()
  const items = workspaces.find(w => w.id === id)!.items

  items.forEach(i => executeItem(i.id))
}

export const stopAllItems = (id: number) => {
  const workspaces = $workspaceStore.getState()
  const items = workspaces.find(w => w.id === id)!.items

  items.forEach(i => stopItem(i.id))
}

export const save = createEvent()

export const storeMutationMergedEvents = merge([
  createWorkspace,
  updateWorkspace,
  createItem,
  updateItem,
  deleteItem,
  deleteWorkspace,
])

const getItemById = (id: number) => {
  const item: IWorkspaceItem = (() => {
    let result: IWorkspaceItem
    const workspaces = $workspaceStore.getState()

    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i]

      for (let j = 0; j < workspace.items.length; j++) {
        const item = workspace.items[j]

        if (item.id === id) {
          result = item
        }
      }
    }
    return result!
  })()

  return item
}

export const executeItem = (id: number) => {
  const item = getItemById(id)
  if (item.isRunned) return

  const cmd = spawn("powershell.exe")
  console.log(cmd)
  cmd.stdout.on("data", data => {
    console.log(`data: ${new TextDecoder().decode(data)}`)
  })
  cmd.stderr.on("data", data =>
    console.log(`error: ${new TextDecoder().decode(data)}`)
  )
  cmd.stdout.on("error", data => console.log(`stdout-error: ${data}`))
  cmd.on("close", data => `close: ${data}`)

  cmd.stdin.write("chcp 65001\n")
  cmd.stdin.write(item.command + `\n`)

  setTimeout(() => {
    console.log(cmd)
  }, 700)

  updateItem({
    id: id,
    isRunned: true,
    pid: cmd.pid,
  })
}

export const stopItem = (id: number) => {
  const item = getItemById(id)

  if (item.pid) {
    treeKill(item.pid)
  }

  updateItem({
    id,
    pid: null,
    isRunned: false,
    isError: false,
  })
}

sample({
  clock: storeMutationMergedEvents,
  target: save,
})

$workspaceStore.on(save, s => {
  localStorage.setItem(
    "workspaceStore",
    JSON.stringify(
      $workspaceStore.getState().map(w => ({
        ...w,
        items: w.items.map(i => ({
          id: i.id,
          command: i.command,
          isError: false,
          isRunned: false,
          name: i.name,
        })),
      }))
    )
  )

  return s
})

$workspaceStore.on(createWorkspace, (s, p) => {
  return [...s, p]
})

$workspaceStore.on(updateWorkspace, (s, p) => {
  return s.map(w => {
    if (w.id === p.id) {
      return {
        ...w,
        name: p.name,
      }
    }

    return w
  })
})

$workspaceStore.on(createItem, (s, p) => {
  return s.map(w => {
    if (w.id === p.workspace) {
      return {
        ...w,
        items: [...w.items, p],
      }
    }

    return w
  })
})

$workspaceStore.on(deleteItem, (s, p) => {
  return s.map(w => ({
    ...w,
    items: w.items.filter(i => i.id !== p),
  }))
})

$workspaceStore.on(updateItem, (s, p) => {
  return s.map(w => ({
    ...w,
    items: w.items.map(i => {
      if (i.id === p.id) {
        return {
          ...i,
          ...p,
        }
      }

      return i
    }),
  }))
})

$workspaceStore.on(deleteWorkspace, (s, p) => {
  return s.filter(w => w.id !== p)
})
