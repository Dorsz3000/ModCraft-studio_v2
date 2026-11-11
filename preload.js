const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('modcraft', {
  saveProject: data => ipcRenderer.invoke('save-project', data),
  openProject: () => ipcRenderer.invoke('open-project')
});