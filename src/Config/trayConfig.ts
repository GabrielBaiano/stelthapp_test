import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron';
import path from 'path';

export function createTray(win: BrowserWindow, configWin: BrowserWindow): Tray {
  // Garante que o caminho para o ícone esteja correto
  const iconPath = path.join(app.getAppPath(), 'assets/icons/icon.jpg');
  const icon = nativeImage.createFromPath(iconPath);
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mini',
      click: () => {
        win.setSize(400, 400);
        win.show();
      }
    },
    {
      label: 'Show/Hide',
      click: () => {
        win.isVisible() ? win.hide() : win.show();
      }
    },
    {
      label: 'Configurações',
      click: () => {
        configWin.loadFile(path.join(app.getAppPath(), 'pages/configPage/config.html'));
        configWin.show();
      }
    },
    { type: 'separator' }, // Adiciona uma linha de separação
    {
      label: 'Fechar',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('StelthApp Test'); // Texto que aparece ao passar o mouse sobre o ícone
  tray.setContextMenu(contextMenu);

  return tray;
}