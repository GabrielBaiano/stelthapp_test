import { app, BrowserWindow, Tray } from 'electron';
import path from 'path';
import { createMainWindowOptions, configWindowOptions } from './Config/windowConfig';
import { createTray } from './Config/trayConfig';

// ===================================================================
// ADDON hideWindow
// ===================================================================

const affinityAddon = require(path.join(__dirname, '..', 'hideWindow', 'build', 'Release', 'affinity_addon.node'));

const applyProtection = (win: BrowserWindow) => {
  try {
    const handleBuffer = win.getNativeWindowHandle();
    const hwnd = handleBuffer.readBigUInt64LE(); //bigInt
    const success = affinityAddon.setWindowDisplayAffinity(hwnd);

    if (success) {
      console.log(`Proteção de tela aplicada com sucesso à janela: ${win.getTitle()}`);
    } else {
      console.error(`Falha ao aplicar proteção de tela na janela: ${win.getTitle()}`);
    }
  } catch (error) {
    console.error('Erro crítico ao chamar o addon nativo:', error);
  }
};
// ===================================================================

let tray: Tray | null = null;

function createWindows() {
  const win = new BrowserWindow(createMainWindowOptions());
  win.loadFile(path.join(__dirname, './pages/homePage/index.html'));

    // Me descomente para DEVtools ! ! !
    // win.webContents.openDevTools();

  const configWin = new BrowserWindow(configWindowOptions);
  
  // -------- ADDON ----------------------------
  win.on('ready-to-show', () => applyProtection(win));
  configWin.on('ready-to-show', () => applyProtection(configWin));
  // ------------------------------------

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