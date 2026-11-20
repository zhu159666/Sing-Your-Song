// 只把"存/读工程"两件事暴露给页面，其余能力一律不开放。
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isDesktop: true,
  saveProject: (text) => ipcRenderer.invoke('project:save', text),
  openProject: () => ipcRenderer.invoke('project:open'),
  onMenu: (handler) => {
    ipcRenderer.on('menu:import', () => handler('import'));
    ipcRenderer.on('menu:export', () => handler('export'));
  },
});
