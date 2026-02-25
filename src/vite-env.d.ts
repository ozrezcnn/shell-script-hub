/// <reference types="vite/client" />
import * as childProcess from "child_process"

export declare global {
  interface Window {
    cmd: {
      spawn: typeof childProcess.spawn
    }
  }
}
