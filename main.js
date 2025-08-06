const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron');

let tray;

// function createWindow() {
//   win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     show: false,
//     frame: false,
//     skipTaskbar: true,
//     resizable:false,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });

//   win.loadFile('pages/homePage/index.html');
// }

app.whenReady().then(() => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
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
      const { x, y } = tray.getBounds();
      win.setPosition(x - 250, y - 360);
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


