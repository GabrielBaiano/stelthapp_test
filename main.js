<<<<<<< HEAD
const { app, Tray, Menu, nativeImage, BrowserWindow, screen } = require('electron');
=======
import { app, Tray, Menu, nativeImage, BrowserWindow, screen } from 'electron';
>>>>>>> Inicial-tests

let tray;

app.whenReady().then(() => {

<<<<<<< HEAD
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
=======
const { width, height } = screen.getPrimaryDisplay().workAreaSize;
>>>>>>> Inicial-tests


console.log('Resolução da tela:', width, height*0.9);

// a ser refatorado !

  const win = new BrowserWindow({
    width: Math.round(width * 0.25),
    height: Math.round(height * 0.9),
    x: Math.round(width - (width*0.26)),
    y: Math.round(height*0.05),
    show: true,
    frame: false,
    skipTaskbar: true,
    resizable:false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('pages/homePage/index.html');

  const icon = nativeImage.createFromPath('assets/icons/icon.jpg');
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {label: 'mini', click: ()=> {
      win.setSize(400, 400);
      // const { x, y } = tray.getBounds();
      // win.setPosition(x - 250, y - 360);
      win.show();
    }},

    {label: 'show/hide', click: ()=> {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    }},
    
    {label: 'Close', click: ()=> {
      app.quit();
    }}
  ]);

  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


