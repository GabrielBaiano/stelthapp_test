import { globalShortcut, BrowserWindow } from 'electron';

export function registerShortcuts(win: BrowserWindow) {
  globalShortcut.register('CommandOrControl+M', () => {
    if (win && !win.isDestroyed()) {
      win.isMinimized() ? win.restore() : win.minimize();
    }
  });

  globalShortcut.register('CommandOrControl+T', () => {
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(!win.isAlwaysOnTop());
    }
  });

  globalShortcut.register('CommandOrControl+F', () => {
    if (win && !win.isDestroyed() && win.isVisible()) {
      win.focus();
      win.webContents.send('focus-input-box');
    }
  });
}

export function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
