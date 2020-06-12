import { superagentReq, superagentForm } from '../superagent'
import { encodeURIComponentGBK } from '../utils'
const config = require('../config')
const cheerio = require('cheerio')

const avatarArr = [
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar',
  'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591863708264&di=09bb931155878c5623cf02595337b8cc&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F40%2F17%2F07%2F58f7227f997dc.png',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591863759942&di=90cd6212aa86212bb7c76b9dccc4f992&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2018-01-19%2F5a614ae41728b.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591863793693&di=a88724cf659fd0720b346900da58ce2a&imgtype=0&src=http%3A%2F%2Fp.ssl.qhimg.com%2Ft01c4587694a3ff55a9.jpg%3Fsize%3D995x622'
]

export async function getOne () { // 获取每日一句
  try {
    let res = await superagentReq(config.APP.ONE, 'GET')
    let $ = cheerio.load(res.text)
    let todayOneList = $('#carousel-one .carousel-inner .item')
    let todayOne = $(todayOneList[0]).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, '')
    return todayOne
  } catch (err) {
    console.log('错误', err)
    return err
  }
}

export async function getWeather () {
  let url = config.APP.MOJI_HOST + config.APP.CITY + '/' + config.APP.LOCATION
  let res = await superagentReq(url, 'GET')
  let $ = cheerio.load(res.text)
  let weatherTips = $('.wea_tips em').text()
  const today = $('.forecast .days').first().find('li')
  let todayInfo = {
    Day: $(today[0]).text().replace(/(^\s*)|(\s*$)/g, ''),
    WeatherText: $(today[1]).text().replace(/(^\s*)|(\s*$)/g, ''),
    Temp: $(today[2]).text().replace(/(^\s*)|(\s*$)/g, ''),
    Wind: $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ''),
    WindLevel: $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ''),
    PollutionLevel: $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, '')
  }
  let obj = {
    weatherTips: weatherTips,
    todayWeather: todayInfo.Day + ':' + todayInfo.WeatherText + '<br>' + '温度:' + todayInfo.Temp + '<br>' +
      todayInfo.Wind + todayInfo.WindLevel + '<br>' + '空气:' + todayInfo.PollutionLevel + '<br>'
  }
  return obj
}

export async function getMedia (keyword, channel, source) {
  let resultData
  if (!keyword) {
    return {
      code: 1000,
      data: null
    }
  }
  switch (source) {
    case 'hot':
      resultData = await getHot(keyword, channel)
      break
    case 'dytt':
      resultData = await getDytt(keyword, channel)
      break
  }
  return resultData
}

/**
 * 爬取电影天堂资源
 * @param {*} keyword 搜索词
 * @param {*} channel 类型
 */
async function getDytt (keyword, channel) {
  console.log('keyword', keyword, channel)
  let key = encodeURIComponentGBK(keyword)
  let url = `http://s.ygdy8.com/plus/s0.php?typeid=${channel}&keyword=${key}`
  let res = await superagentReq(url, 'GET', 'gbk')
  let $ = cheerio.load(res.text)
  let resultPage = []
  $('.co_content8 ul table').each((i, e) => {
    var src = $(e).find('a').attr('href')
    resultPage.push(`https://www.ygdy8.com${src}`)
  })
  let singlePromiseList = resultPage.reduce((arr, item) => {
    let data = findDownloadDytt(item, channel)
    arr.push(data)
    return arr
  }, [])
  let resultData = await Promise.all(singlePromiseList)
  console.log('resultData', resultData)
  return resultData.length > 0 ? resultData : []
}

/**
 * 获取电影天堂详情页数据
 * @param {*} url
 * @param {*} channel
 */
async function findDownloadDytt (url, channel) {
  let res = await superagentReq(url, 'GET', 'gbk')
  let $ = cheerio.load(res.text)
  let dowmloadUrl = []
  let img = $('#Zoom span p').find('img')
  let result = {
    title: $('.title_all h1 font').text() || '',
    mainperson: '电影天堂暂未获取该信息，敬请期待',
    desc: '电影天堂暂未获取该信息，敬请期待',
    headImg: $(img[1]).attr('src') || ''
  }
  if (channel === 1) {
    dowmloadUrl.push($('#Zoom span table').find('a').text() || '')
  } else if (channel === 2) {
    let targetDom = $('#Zoom span table').length !== 0
      ? $('#Zoom span table')
      : $('#Zoom span')
    $(targetDom).find('a').each((i, e) => {
      if ($(e).attr('href') !== '#') {
        dowmloadUrl.push($(e).attr('href'))
      } else {
        dowmloadUrl.push($(e).text())
      }
    })
  }
  let random = Math.floor(Math.random() * 5 + 1)
  result.avatar = avatarArr[random]
  result.dowmloadUrl = dowmloadUrl
  return result
}

/**
 * 热门影视爬取西瓜视频
 * @param {*} keyword
 * @param {*} channel
 */
export async function getHot (keyword, channel) {
  if (!keyword) {
    return {
      code: 1000,
      data: null
    }
  }
  console.log('keyword', keyword, channel)
  // let key = encodeURIComponentGBK(keyword)
  let url = `http://xigua12.com/search.php`
  let res = await superagentForm({
    url,
    method: 'POST',
    data: {
      searchword: keyword
    }
  })
  let $ = cheerio.load(res.text)
  // console.log('热门影视', $)
  let resultPage = []
  $('.thumbnail-group li').each((i, e) => {
    var src = $(e).find('a').attr('href')
    resultPage.push(`http://xigua12.com${src}`)
  })
  let singlePromiseList = resultPage.reduce((arr, item) => {
    let data = findDownloadHot(item, channel)
    arr.push(data)
    return arr
  }, [])
  let resultData = await Promise.all(singlePromiseList)
  // console.log('resultData', resultData)
  return resultData.length > 0 ? resultData : []
}

/**
 * 获取西瓜视频详情页数据
 * @param {*} url
 * @param {*} channel
 */
async function findDownloadHot (url, channel) {
  let mainpersonArray = []
  let res = await superagentReq(url, 'GET')
  let $ = cheerio.load(res.text)
  let dowmloadUrl = []
  let img = $('.detail-poster a').find('img')
  $('.detail-actor li a').each((i, e) => {
    mainpersonArray.push($(e).text())
  })
  let result = {
    title: $('.detail-info h2').text() || '',
    mainperson: mainpersonArray.join(','),
    desc: $('.detail-intro').text(),
    headImg: $(img[0]).attr('data-original') || ''
  }

  $('#detail-content .ff-downurl').find('li').each((i, e) => {
    dowmloadUrl.push($(e).find('a').attr('href'))
  })

  let random = Math.floor(Math.random() * 5 + 1)

  result.avatar = avatarArr[random]
  result.dowmloadUrl = dowmloadUrl
  console.log('result西瓜影视', result)
  return result
}
