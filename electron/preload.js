const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  login: (email, password) => ipcRenderer.invoke('login', email, password),
  registerUser: (userData) => ipcRenderer.invoke('registerUser', userData),
  registerClient: (userData) => ipcRenderer.invoke('registerClient', userData),
  searchUsers: (searchQuery) => ipcRenderer.invoke('searchUsers', searchQuery),
  registerNewSubscription: (subscriptionData) => ipcRenderer.invoke('registerNewSubscription', subscriptionData),
  getAllSubscriptions: () => ipcRenderer.invoke('getAllSubscriptions'),
  updateSubscription: (subscriptionData) => ipcRenderer.invoke('updateSubscription', subscriptionData),
  searchSubs: (searchQuery) => ipcRenderer.invoke('searchSubs', searchQuery),
});
