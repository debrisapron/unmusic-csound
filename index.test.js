let { csScoreFromJs } = require('.')

it('can convert a simple unmusic script into a csound score', () => {
  let script = `return arrange(1, 'A B C D')`
  let expectedScore = `
    i 1 0 0.25 440
    i 1 0.25 0.25 493.8833012561241
    i 1 0.5 0.25 261.6255653005986
    i 1 0.75 0.25 293.6647679174076
  `
  let csScore = csScoreFromJs(script)
  expect(trimLines(csScore)).toBe(trimLines(expectedScore))
})

it('can handle csound params p5 and above while ignoring all others', () => {
  let script = `return arrange(1, 'p4=4 p5=5 p7=7 foo=bar A')`
  let expectedScore = `i 1 0 0.25 440 5 0 7`
  let csScore = csScoreFromJs(script)
  expect(trimLines(csScore)).toBe(trimLines(expectedScore))
})

let trimLines = (str) =>
  str
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s)
    .join('\n')
