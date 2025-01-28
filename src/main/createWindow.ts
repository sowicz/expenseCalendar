import { BrowserWindow, ipcMain, shell } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';

export function createWindow(): void {
  const mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 680,
    width: 900,
    height: 680,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  ipcMain.on('minimize', () => mainWindow.minimize());
  ipcMain.on('maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('closeWindow', () => mainWindow.close());
}
