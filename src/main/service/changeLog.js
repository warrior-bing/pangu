import { app } from 'electron'
const sd = require('silly-datetime')
const fs = require('fs')
const getMAC = require('getmac').default
// const LOCALPATH = path.resolve(__dirname, '../../../static/')
const userDataPath = app.getPath('userData')
const FILENAME = `${getMAC().replace(/:/g, '')}.json`
const FILEPATH = `${userDataPath}/${FILENAME}`
const UTF = 'utf-8'
// let tokens
const writeLog = (action, log) => {
  fs.access(`${FILEPATH}`, (has) => {
    console.log('has', has)
    if (!has) {
      console.log('已存在该文件')
      let transform = {
        createTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        action: action,
        log: log
      }
      fs.readFile(FILEPATH, UTF, (err1, data) => {
        let content = JSON.parse(data)
        content.push(transform)
        fs.writeFileSync(`${FILEPATH}`, JSON.stringify(content), UTF, (err) => {
          console.log('错误', err)
        })
      })
    } else {
      console.log('不存在该文件')
      let init = [{
        createTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        action: '初始化',
        log: log
      }]
      fs.writeFile(`${FILEPATH}`, JSON.stringify(init), UTF, () => {
        console.log('写入成功')
      })
    }
  })
}

const getLog = () => {
  console.log('FILEPATH', FILEPATH)
  let result
  try {
    result = fs.readFileSync(`${FILEPATH}`, UTF)
  } catch (error) {
    result = null
  }
  return result
}

export {
  writeLog,
  getLog
}
