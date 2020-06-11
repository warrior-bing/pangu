import { writeLog } from './changeLog'
import httpRequest from '../superagent'
const OSS = require('ali-oss')
const settings = require('electron-settings')
const fs = require('fs')
const config = require('../config')

let tokens

async function upFile (key, localFile) {
  let uploadConfig = settings.get('config_variable')
  let dirPath = uploadConfig.dirName + uploadConfig.fileHeader
  let client = new OSS(tokens)
  try {
    let result = await client.putStream(dirPath + key, fs.createReadStream(localFile))
    console.log(`${result.url} -----success`)
    return result.url
  } catch (e) {
    console.log(e)
    console.log(`https://image.jydata.com/${dirPath + key} -----error:${e}`)
  }
  console.log('upload end.')
}

export default async function uploadFiles () {
  let res = await httpRequest(config.APP.OSSSTS, 'GET')
  let { data } = JSON.parse(res)
  if (data !== null) {
    let {
      region,
      bucket,
      securityToken: stsToken,
      accessKeyId,
      accessKeySecret
    } = data
    tokens = {region, bucket, stsToken, accessKeyId, accessKeySecret}
    console.log('STS临时授权成功，walkFiles', tokens)
    writeLog('上传授权', `STS临时授权成功，bucket：${bucket}，region：${region}`)
    // 获取选中的key path
    let { paths } = settings.get('Keys')
    console.log('ipcMain-paths', paths)

    let asyncOSSPath = paths.reduce((arr, it) => {
      let OSSPath = upFile(it.key, it.localPath)
      console.log('OSSPath', OSSPath)
      arr.push(OSSPath)
      return arr
    }, [])
    let resultOSSPath = await Promise.all(asyncOSSPath)
    console.log('resultOSSPath', resultOSSPath)
    writeLog('上传文件', resultOSSPath)
    return resultOSSPath
  } else {
    console.log('STS临时授权失败')
  }
}
