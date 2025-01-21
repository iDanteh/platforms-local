const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  login: (email, password) => ipcRenderer.invoke('login', email, password),
  registerUser: (userData) => ipcRenderer.invoke('registerUser', userData),
  registerClient: (userData) => ipcRenderer.invoke('registerClient', userData),
  
});
