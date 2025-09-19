import { app, BrowserWindow } from "electron";
import { createMainWindowOptions } from "./Config/windowConfig";
import { createTray } from "./Config/trayConfig";
import { applyProtection } from "./Config/addonConfig";
import { registerShortcuts, unregisterShortcuts } from "./Config/shortcutConfig";
import { setupCarousel } from "./Config/carouselConfig"; 

let mainWin: BrowserWindow | null = null;

function createWindows() {
  mainWin = new BrowserWindow(createMainWindowOptions());

  mainWin.on("ready-to-show", () => {
    applyProtection(mainWin!);
  });

  // inicializa carrossel dentro da mainWin
  setupCarousel(mainWin);

  createTray(mainWin, mainWin); // mantém compatibilidade
  registerShortcuts(mainWin);
}

app.whenReady().then(createWindows);

app.on("will-quit", () => {
  unregisterShortcuts();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
