let iconv = require('iconv-lite')

export function encodeURIComponentGBK (str) {
  if (str === null || typeof str === 'undefined' || str === '') {
    return ''
  }
  var a = str.toString().split('')
  for (var i = 0; i < a.length; i++) {
    var ai = a[i]
    if ((ai >= '0' && ai <= '9') || (ai >= 'A' && ai <= 'Z') || (ai >= 'a' && ai <= 'z') || ai === '.' || ai === '-' || ai === '_') {
      continue
    }
    var b = iconv.encode(ai, 'gbk')
    var e = ['']
    for (var j = 0; j < b.length; j++) {
      e.push(b.toString('hex', j, j + 1).toUpperCase())
    }
    a[i] = e.join('%')
  }
  return a.join('')
}
