import { BrowserWindow, BrowserView, globalShortcut } from "electron";
import * as path from "path";

// Variáveis que pertencem SOMENTE ao carrossel
let currentIndex = 0;
let views: BrowserView[] = [];
let mainWindowRef: BrowserWindow | null = null; // Referência para a janela principal

// Lista de páginas do carrossel
const pages = [
  path.join(__dirname, "../pages/homePage/index.html"),
  path.join(__dirname, "../pages/configPage/config.html"),
  path.join(__dirname, "../pages/pomodoroPage/pomodoro.html"),
];

// Função que move o carrossel
function moveCarousel(direction: 'up' | 'down') {
  if (!mainWindowRef) return; // Segurança

  // Atualiza o índice
  if (direction === 'down' && currentIndex < views.length - 1) {
    currentIndex++;
  } else if (direction === 'up' && currentIndex > 0) {
    currentIndex--;
  }

  // Move todas as views para a nova posição
  const currentBounds = mainWindowRef.getBounds();
  views.forEach((view, i) => {
    const newY = (i - currentIndex) * currentBounds.height;
    view.setBounds({
      x: 0,
      y: newY,
      width: currentBounds.width,
      height: currentBounds.height,
    });
  });
}

// Função principal que será exportada
export function setupCarousel(mainWindow: BrowserWindow) {
  mainWindowRef = mainWindow;
  const bounds = mainWindow.getBounds();

  // Cria e posiciona as BrowserViews
  views = pages.map((page) => {
    const view = new BrowserView();
    view.webContents.loadFile(page);
    return view;
  });

  views.forEach((view, i) => {
    mainWindow.addBrowserView(view);
    view.setBounds({
      x: 0,
      y: i * bounds.height,
      width: bounds.width,
      height: bounds.height,
    });
  });

  // Registra os atalhos de teclado AQUI
  globalShortcut.register('Alt+Down', () => moveCarousel('down'));
  globalShortcut.register('Alt+Up', () => moveCarousel('up'));

  // Lógica de redimensionamento
  mainWindow.on('resize', () => {
    const newBounds = mainWindow.getBounds();
    views.forEach((view, i) => {
      const newY = (i - currentIndex) * newBounds.height;
      view.setBounds({
        x: 0,
        y: newY,
        width: newBounds.width,
        height: newBounds.height
      });
    });
  });
}

// Função para limpar os atalhos
export function unregisterCarouselShortcuts() {
  globalShortcut.unregisterAll();
}