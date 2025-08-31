import { app, BrowserWindow } from 'electron';
import path from 'path';

import { createMainWindowOptions, configWindowOptions } from './Config/windowConfig';
import { createTray } from './Config/trayConfig';
import { applyProtection } from './Config/addonConfig';
import { registerShortcuts, unregisterShortcuts } from './Config/shortcutConfig';

let mainWin: BrowserWindow | null = null;
let configWin: BrowserWindow | null = null;

function createWindows() {
  mainWin = new BrowserWindow(createMainWindowOptions());
  mainWin.loadFile(path.join(__dirname, './pages/homePage/index.html'));

  configWin = new BrowserWindow(configWindowOptions);
  // configWin.loadFile(path.join(__dirname, './pages/configPage/config.html'));

  mainWin.on('ready-to-show', () => applyProtection(mainWin!));
  configWin.on('ready-to-show', () => applyProtection(configWin!));

  configWin.on('close', (event) => {
    event.preventDefault();
    configWin!.hide();
  });

  createTray(mainWin, configWin);
  registerShortcuts(mainWin);
}

app.whenReady().then(createWindows);

app.on('will-quit', () => {
  unregisterShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
