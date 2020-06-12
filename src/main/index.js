'use strict'

import { app, BrowserWindow } from 'electron'
import { getOne, getWeather, getMedia } from './service/crawler'
import * as menu from './menu'
import checkVersion from './updateCheck'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    frame: true,
    titleBarStyle: 'hidden',
    height: 600,
    useContentSize: true,
    backgroundColor: '#fff',
    width: 1100,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  menu.init()
  checkVersion()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

global.services = {
  getOne,
  getWeather,
  getMedia
}
