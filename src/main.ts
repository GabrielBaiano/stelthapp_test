import { app, BrowserWindow, Tray, globalShortcut } from 'electron';
import path from 'path';
import { createMainWindowOptions, configWindowOptions } from './Config/windowConfig';
import { createTray } from './Config/trayConfig';

// ===================================================================
// Lógica de Caminho Inteligente para o Addon Nativo
// ===================================================================
const isDev = !app.isPackaged;
const addonPath = isDev
  ? path.join(__dirname, '..', 'hideWindow', 'build', 'Release', 'affinity_addon.node')
  : path.join(process.resourcesPath, 'app', 'affinity_addon.node');

let affinityAddon;
try {
  affinityAddon = require(addonPath);
} catch (error) {
  console.error('Falha ao carregar o addon nativo:', error);
  affinityAddon = { setWindowDisplayAffinity: () => false };
}

const applyProtection = (win: BrowserWindow) => {
  try {
    const handleBuffer = win.getNativeWindowHandle();
    const hwnd = handleBuffer.readBigUInt64LE();
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

  const configWin = new BrowserWindow(configWindowOptions);
  // Você precisará criar e carregar um arquivo para a janela de config
  // configWin.loadFile(path.join(__dirname, '../pages/configPage/config.html'));

  win.on('ready-to-show', () => applyProtection(win));
  configWin.on('ready-to-show', () => applyProtection(configWin));
  
  configWin.on('close', (event) => {
    event.preventDefault();
    configWin.hide();
  });

  tray = createTray(win, configWin);
  
  // Atalhos Globais
  globalShortcut.register('CommandOrControl+M', () => {
    // MODIFICADO: Ação aplicada apenas à janela principal 'win'
    if (win && !win.isDestroyed()) {
      win.isMinimized() ? win.restore() : win.minimize();
    }
  });

  globalShortcut.register('CommandOrControl+T', () => {
    // MODIFICADO: Ação aplicada apenas à janela principal 'win'
    if (win && !win.isDestroyed()) {
      const isAlwaysOnTop = win.isAlwaysOnTop();
      win.setAlwaysOnTop(!isAlwaysOnTop);
    }
  });

  // Este atalho já afeta apenas a janela principal, não precisa de alteração.
  globalShortcut.register('CommandOrControl+F', () => {
    if (win && !win.isDestroyed() && win.isVisible()) {
      win.focus();
      win.webContents.send('focus-input-box');
    }
  });
}

app.whenReady().then(createWindows);

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
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