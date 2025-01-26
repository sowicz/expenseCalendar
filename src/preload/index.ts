import { contextBridge, ipcRenderer  } from 'electron'


contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    // on: (channel, callback) => ipcRenderer.on(channel, callback),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),  },
});
