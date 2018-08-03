#!/usr/bin/env node
'use strict'

let fs = require('fs')
let { csScoreFromJs } = require('..')

process.on('uncaughtException', (err) => {
  fs.writeFileSync('error.log', err.message, { encoding: 'UTF8' })
  throw err
});

let inputFile = process.argv[2]
let outputFile = process.argv[3]
let js = fs.readFileSync(inputFile, { encoding: 'UTF8' })
let csScore = csScoreFromJs(js)
console.log(csScore)
fs.writeFileSync(outputFile, csScore, { encoding: 'UTF8' })
