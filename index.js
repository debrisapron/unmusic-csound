let um = require('unmusic-core')

let csScoreFromUmScore = (umScore) => {
  csLines = []
  let { actions, tempo } = umScore
  if (tempo) csLines.push(`t 0 ${tempo}`)
  actions.forEach((action) => csLines.push(csActionFromUmAction(action)))
  return csLines.filter((x) => x).join('\n')
}

let csActionFromUmAction = (umAction) => {
  let { type, payload } = umAction
  if (type === 'NOOP') return
  let {  }
}
