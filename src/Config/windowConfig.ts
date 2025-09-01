import { BrowserWindowConstructorOptions, screen } from 'electron';
import path from 'path'; // <-- ADICIONEI A IMPORTAÇÃO DO PATH

// Transformamos a configuração da janela principal em uma FUNÇÃO
export function createMainWindowOptions(): BrowserWindowConstructorOptions {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  return {
    width: Math.round(width * 0.25),
    height: Math.round(height * 0.9),
    x: Math.round(width - (width * 0.26)),
    y: Math.round(height * 0.05),
    show: true,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  };
}

export const configWindowOptions: BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  show: false,
  webPreferences: {
    // --- MUDANÇAS IMPORTANTES APLICADAS AQUI TAMBÉM ---
    preload: path.join(__dirname, '../preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  },
};