'use strict'
let requireFromString = require('require-from-string')
let um = require('unmusic-core')

let twelveTet = (nn, ref = 440) => nn && Math.pow(2, (nn - 69) / 12) * ref

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
  return `i ${instr} ${time} ${dur} ${freq}`
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
