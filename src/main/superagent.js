const request = require('request')
const superagent = require('superagent')
const superagentCharset = require('superagent-charset')(superagent)

// 请求
export function superagentReq (url, method, charset1 = 'utf-8', params, data, cookies) {
  return new Promise(function (resolve, reject) {
    superagentCharset(method, url)
      .charset(charset1)
      .query(params)
      .send(data)
      .end((err, response) => {
        if (err) {
          reject(err)
        }
        resolve(response)
      })
  })
}

// 请求
export function superagentForm ({url, method, charset1 = 'utf-8', params, data, cookies}) {
  return new Promise(function (resolve, reject) {
    superagentCharset(method, url)
      .type('form')
      .charset(charset1)
      .query(params)
      .send(data)
      .end((err, response) => {
        if (err) {
          reject(err)
        }
        resolve(response)
      })
  })
}

export function httpRequest (url, method) {
  return new Promise(function (resolve, reject) {
    request({
      url,
      method
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(new Error({
          code: 10000,
          data: null
        }))
      }
    })
  })
}
