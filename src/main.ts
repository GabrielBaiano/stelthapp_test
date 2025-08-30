import { app, BrowserWindow, Tray, globalShortcut } from 'electron';
import path from 'path';
import { createMainWindowOptions, configWindowOptions } from './Config/windowConfig';
import { createTray } from './Config/trayConfig';

// ===================================================================
// Lógica de Caminho Inteligente para o Addon Nativo
// ===================================================================

// 1. Detecta se o app está rodando em modo de desenvolvimento ou empacotado
const isDev = !app.isPackaged;

// 2. Define o caminho correto para o addon baseado no ambiente
const addonPath = isDev
  // Se estiver em desenvolvimento, usa o caminho relativo a partir do código-fonte
  ? path.join(__dirname, '..', 'hideWindow', 'build', 'Release', 'affinity_addon.node')
  // Se estiver instalado, busca o addon na pasta de recursos do app
  : path.join(process.resourcesPath, 'app', 'affinity_addon.node');

// 3. Carrega o addon usando o caminho correto
let affinityAddon;
try {
  affinityAddon = require(addonPath);
} catch (error) {
  console.error('Falha ao carregar o addon nativo:', error);
  // Em caso de falha, podemos criar um objeto falso para evitar que o resto do app quebre
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

  win.on('ready-to-show', () => applyProtection(win));
  configWin.on('ready-to-show', () => applyProtection(configWin));
  
  configWin.on('close', (event) => {
    event.preventDefault();
    configWin.hide();
  });

  tray = createTray(win, configWin);
  
  // Atalhos Globais
  globalShortcut.register('CommandOrControl+M', () => {
    const windows = [win, configWin];
    windows.forEach(w => {
      if (w && !w.isDestroyed()) {
        w.isMinimized() ? w.restore() : w.minimize();
      }
    });
  });

  globalShortcut.register('CommandOrControl+T', () => {
    const isAlwaysOnTop = win.isAlwaysOnTop();
    const windows = [win, configWin];
    windows.forEach(w => {
      if (w && !w.isDestroyed()) {
        w.setAlwaysOnTop(!isAlwaysOnTop);
      }
    });
  });

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