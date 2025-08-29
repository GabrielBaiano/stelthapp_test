import { Menu, Tray, BrowserWindow, nativeImage, app } from "electron";
import path from "path";

let scriptActive = false;

export function createTray(win: BrowserWindow, configWin: BrowserWindow): Tray {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, "../assets/icons/icon.jpg")
  );
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Minimizar/Restaurar",
      click: () => {
        if (win.isMinimized()) {
          win.restore();
          win.focus();
        } else {
          win.minimize();
        }
      },
    },
    // {
    //   label: "Configurações",
    //   click: () => {
    //     configWin.loadFile(
    //       path.join(__dirname, "../pages/configPage/config.html")
    //     );
    //     configWin.show();
    //   },
    // },
    // {
    //   label: scriptActive ? "Script: Ativo ✅" : "Script: Inativo ❌",
    //   enabled: false // só mostra status, não é clicável
    // },
    {
      type: "separator",
    },
    {
      label: "Fechar Tudo",
      click: () => {
        tray.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Test stelf true or false
  function updateScriptStatus(active: boolean) {
    scriptActive = active;
    const items = contextMenu.items;
    const statusItem = items.find(item => item.label.startsWith("Script:"));
    if (statusItem) {
      statusItem.label = active ? "Script: Ativo ✅" : "Script: Inativo ❌";
    }
    tray.setContextMenu(contextMenu); // atualiza menu
  }

  (tray as any).updateScriptStatus = updateScriptStatus;

  return tray;
}
