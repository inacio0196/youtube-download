/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import youtubedl from 'youtube-dl';
import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import fs from 'fs';
import os from 'os';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// IPC Main
ipcMain.on('download-video-ipcmain', (event, args) => {
  const options = {
    title: 'Save file',
    defaultPath: os.homedir(),
    buttonLabel: 'Save',
    nameFieldLabel: 'video.mp4',
    filters: [{ name: 'Movie', extensions: ['mp4', 'mkv', 'webm'] }],
  };

  dialog.showSaveDialog(mainWindow, options).then(({ filePath }) => {
    ytdl(args.videoUrl)
      .pipe(fs.createWriteStream(`${filePath}.webm`));
  });

  event.sender.send('download-video-ipcrender', 'resposta video');
});

ipcMain.on('download-mp3-ipcmain', (event, args) => {
  console.log('download-mp3-ipcmain', { mp3_main: args });
  const options = {
    title: 'Save file',
    defaultPath: os.homedir(),
    buttonLabel: 'Save',
    nameFieldLabel: 'music.mp4',
    filters: [{ name: 'Music', extensions: ['mp3', 'm4a'] }],
  };

  dialog.showSaveDialog(mainWindow, options).then(({ filePath }) => {
    ytdl(args.videoUrl)
      .pipe(fs.createWriteStream(`${filePath}.webm`));
    convertMp4ToMp3(`${filePath}.webm`, `${filePath}.mp3`);
  });

  event.sender.send('download-mp3-ipcrender', 'resposta mp3');
});

const convertMp4ToMp3 = (srcPath: string, newPath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(srcPath)
      .format('mp3')
      .on('error', reject)
      .on('end', function () {
        resolve(newPath);
      })
      .save(newPath);
  });
};
