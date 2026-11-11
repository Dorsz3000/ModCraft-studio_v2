const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1050, minHeight: 700,
    backgroundColor: '#171a22',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('save-project', async (_event, data) => {
  const result = await dialog.showSaveDialog({ defaultPath: 'moj-projekt.modcraft.json', filters: [{ name: 'ModCraft Project', extensions: ['json'] }] });
  if (result.canceled || !result.filePath) return false;
  fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf8');
  return true;
});
ipcMain.handle('open-project', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'ModCraft Project', extensions: ['json'] }] });
  if (result.canceled || !result.filePaths[0]) return null;
  return JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
});