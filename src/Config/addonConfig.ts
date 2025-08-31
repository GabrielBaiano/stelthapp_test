import { BrowserWindow, app } from 'electron';
import path from 'path';

const isDev = !app.isPackaged;
const addonPath = isDev
  ? path.join(__dirname, '..', 'hideWindow', 'build', 'Release', 'affinity_addon.node')
  : path.join(process.resourcesPath, 'affinity_addon.node');

//   : path.join(process.resourcesPath, 'app', 'affinity_addon.node');

let affinityAddon: { setWindowDisplayAffinity: (hwnd: bigint) => boolean };

try {
  affinityAddon = require(addonPath);
} catch (error) {
  console.error('Falha ao carregar o addon nativo:', error);
  affinityAddon = { setWindowDisplayAffinity: () => false };
}

export function applyProtection(win: BrowserWindow) {
  try {
    const handleBuffer = win.getNativeWindowHandle();
    const hwnd = handleBuffer.readBigUInt64LE();
    const success = affinityAddon.setWindowDisplayAffinity(hwnd);

    if (success) {
      console.log(`Proteção aplicada à janela: ${win.getTitle()}`);
    } else {
      console.error(`Falha ao aplicar proteção na janela: ${win.getTitle()}`);
    }
  } catch (error) {
    console.error('Erro ao chamar o addon nativo:', error);
  }
}
