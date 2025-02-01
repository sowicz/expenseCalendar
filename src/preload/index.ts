import { contextBridge, ipcRenderer  } from 'electron'


contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),

    on: (channel, callback) =>
      ipcRenderer.on(channel, (_, ...args) => callback(...args)),

    off: (channel, callback) =>
      ipcRenderer.removeListener(channel, callback), // This prevents memory leaks
  },
});