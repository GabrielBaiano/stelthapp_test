import { app, BrowserWindow, Tray } from 'electron';
import path from 'path';

// Importa a FUNÇÃO e as opções da janela de config
import { createMainWindowOptions, configWindowOptions } from './Config/windowConfig';
import { createTray } from './Config/trayConfig';

let tray: Tray | null = null;

function createWindows() {
  // CHAMA a função para obter as opções no momento certo!
  const win = new BrowserWindow(createMainWindowOptions());
  win.loadFile(path.join(__dirname, './pages/homePage/index.html'));

    // Me descomente para DEVtools ! ! !
    // win.webContents.openDevTools();

  const configWin = new BrowserWindow(configWindowOptions);
  
  configWin.on('close', (event) => {
    event.preventDefault();
    configWin.hide();
  });

  tray = createTray(win, configWin);
}

app.whenReady().then(createWindows);

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