import { app as n, BrowserWindow as i, ipcMain as p } from "electron";
import { createRequire as d } from "node:module";
import { fileURLToPath as m } from "node:url";
import o from "node:path";
d(import.meta.url);
const r = o.dirname(m(import.meta.url));
process.env.APP_ROOT = o.join(r, "..");
const t = process.env.VITE_DEV_SERVER_URL, w = o.join(process.env.APP_ROOT, "dist-electron"), s = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = t ? o.join(process.env.APP_ROOT, "public") : s;
let e;
function l() {
  e = new i({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(r, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !1
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), t ? e.loadURL(t) : e.loadFile(o.join(s, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && l();
});
p.on("cmd", (a, c) => {
  console.log(a, c);
});
n.whenReady().then(l);
export {
  w as MAIN_DIST,
  s as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};
