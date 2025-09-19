import { BrowserWindow, screen } from "electron";

export function createMainWindowOptions() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  return {
    width: Math.round(screenWidth * 0.25),
    height: Math.round(screenHeight * 0.9),
    x: Math.round(screenWidth - (screenWidth * 0.26)),
    y: Math.round(screenHeight * 0.05),
    frame: false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  };
}
