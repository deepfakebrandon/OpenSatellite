const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("satellite", {
  saveStl: (bytes) => ipcRenderer.invoke("save-stl", bytes)
});