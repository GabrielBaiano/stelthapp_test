import { app, BrowserWindow, Tray, globalShortcut, ipcMain } from 'electron';
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

  // ===================================================================
  // Key bindings
  // ===================================================================
  
  // add , , configWin to [win] >> "const windows = [win, , configWin]; "
  globalShortcut.register('CommandOrControl+M', () => {
    console.log('Comando Minimizar/Restaurar acionado!');
    const windows = [win];
    windows.forEach(w => {
        if (w.isMinimized()) {
            w.restore();
        } else {
            w.minimize();
        }
    });
  });

  globalShortcut.register('CommandOrControl+T', () => {
    console.log('Comando Fixar no Topo acionado!');
    const windows = [win];
    const isAlwaysOnTop = win.isAlwaysOnTop(); // Verificamos o estado de uma janela (assumimos que ambas estão iguais)
    
    windows.forEach(w => {
        w.setAlwaysOnTop(!isAlwaysOnTop);
    });

    console.log(`Janelas estão ${!isAlwaysOnTop ? 'fixadas' : 'normais'}.`);
  });

  globalShortcut.register('CommandOrControl+F', () => {
    console.log('Comando Focar na Caixa de Texto acionado!');
    if (win.isVisible()) {
      win.focus();
      win.webContents.send('focus-input-box');
    }
  });
}

app.whenReady().then(createWindows);

// NOVO: Garante que os atalhos sejam limpos ao sair
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