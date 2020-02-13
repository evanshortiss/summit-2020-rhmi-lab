/**
 * This script helps to format SQL row dumps to valid JSON, e.g an export from
 * COPY(SELECT row_to_json(data) FROM ($QUERY) data) TO '/var/lib/pgsql/query.txt';
 */
const { createReadStream } = require('fs')
const { resolve } = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: createReadStream(resolve(__dirname, './api-data/meters.json'))
})

const rows = []

rl.on('error', (e) => console.log(e))

rl.on('line', function(line) {
  rows.push(JSON.parse(line))
})

rl.on('close', function(line) {
  console.log(JSON.stringify(rows, null, 2))
})
