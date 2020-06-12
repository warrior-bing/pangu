import { dialog, shell } from 'electron'
import { superagentReq } from './superagent'
import pkg from '../../package.json'
const version = pkg.version
const setting = require('electron-settings')
const config = require('./config')

const checkVersion = async () => {
  let showTip = setting.get('showUpdateTip')
  if (showTip === undefined) {
    setting.set('showUpdateTip', true)
    showTip = true
  }
  // 自动更新的弹窗如果用户没有设置不再提醒，就可以去查询是否需要更新
  if (showTip) {
    const res = await superagentReq(config.APP.RELEASE, 'GET')
    if (res.statusCode === 200) {
      let data = JSON.parse(res.text)
      const latest = data.name
      const result = compareVersion2Update(version, latest)
      if (result) {
        dialog.showMessageBox({
          type: 'info',
          title: '发现新版本',
          buttons: ['Yes', 'No'],
          message: '发现新版本，更新了很多功能，是否去下载最新的版本？',
          checkboxLabel: '以后不再提醒',
          checkboxChecked: false
        }, (res, checkboxChecked) => {
          if (res === 0) {
            shell.openExternal(config.APP.DOWNLOADURL)
          }
          setting.set('showUpdateTip', !checkboxChecked)
        })
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

const compareVersion2Update = (current, latest) => {
  const currentVersion = current.split('.').map(item => parseInt(item))
  const latestVersion = latest.split('.').map(item => parseInt(item))
  let flag = false

  for (let i = 0; i < 3; i++) {
    if (currentVersion[i] < latestVersion[i]) {
      flag = true
    }
  }
  return flag
}

export default checkVersion
