export interface IWorkspace {
  id: number
  items: IWorkspaceItem[]
  name: string
}

export interface IWorkspaceItem {
  id: number
  pid: number | null
  name: string
  command: string
  isRunned: boolean
  isError: boolean
}
