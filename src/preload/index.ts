import { contextBridge, ipcRenderer  } from 'electron'


contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),

    on: (channel, callback) =>
      ipcRenderer.on(channel, (event, ...args) => callback(...args)),

    off: (channel, callback) =>
      ipcRenderer.removeListener(channel, callback), // This prevents memory leaks
  },
});