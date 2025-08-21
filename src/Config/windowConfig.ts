import { BrowserWindowConstructorOptions, screen } from 'electron';

// Transformamos a configuração da janela principal em uma FUNÇÃO
export function createMainWindowOptions(): BrowserWindowConstructorOptions {
  // Agora, esta linha só será executada quando a função for CHAMADA
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
      nodeIntegration: true,
      contextIsolation: false,
    },
  };
}

// A janela de config não usa o 'screen', então pode continuar como uma constante
export const configWindowOptions: BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  show: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  },
};