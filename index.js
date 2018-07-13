'use strict'
let requireFromString = require('require-from-string')
let um = require('unmusic-core')

let twelveTet = (nn, ref = 440) => nn && Math.pow(2, (nn - 69) / 12) * ref

let csParamsFromUmPayload = (payload) => {
  let indexes = Object.keys(payload)
    .filter((key) => key.match(/^p[0-9]+$/))
    .map((key) => parseInt(key.slice(1)))
    .filter((index) => index > 4)
  if (!indexes.length) return ''

  let len = Math.max(...indexes) - 4
  let arr = Array(len).fill(0)
  indexes.forEach((index) => (arr[index - 5] = payload[`p${index}`]))
  return arr.join(' ')
}

let csActionFromUmAction = (umAction) => {
  let { type, payload } = umAction
  if (type === 'NOOP') return
  let {
    nn,
    time,
    dur,
    handlers: [instr]
  } = payload
  let freq = twelveTet(nn)
  instr = isNaN(instr) ? `"${instr}"` : instr
  let params = csParamsFromUmPayload(payload)
  return `i ${instr} ${time} ${dur} ${freq} ${params}`.trim()
}

let csScoreFromUmScore = (umScore) => {
  let csLines = []
  let { actions, tempo } = umScore
  if (tempo) csLines.push(`t 0 ${tempo}`)
  actions.forEach((action) => csLines.push(csActionFromUmAction(action)))
  return csLines.filter((x) => x).join('\n')
}

let csScoreFromJs = (script) => {
  let js = `
    module.exports = (um) => {
      let { ${Object.keys(um).join(', ')} } = um;
      ${script}
    }
  `
  let scoreFn = requireFromString(js)
  let umScore = scoreFn(um)
  return csScoreFromUmScore(umScore)
}

module.exports = { csScoreFromJs }
