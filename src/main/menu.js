import { app, Menu } from 'electron'
const isMac = process.platform === 'darwin'
const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : [])
]
export function init () {
  console.log('(menu) init')
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
