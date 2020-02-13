'use strict'

const express = require('express')
const app = express()
const env = require('env-var')
const { resolve } = require('path')

const PORT = env.get('PORT', '8080').asPortNumber()

app.use(require('morgan')('combined'))
app.use(express.static(resolve(__dirname, 'dist/')))

app.listen(PORT, (err) => {
  console.log(new Date().toJSON(),`server started listening on ${PORT}\n`)
})
