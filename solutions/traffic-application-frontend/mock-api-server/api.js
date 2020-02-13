const delay = require('mocker-api/utils/delay');
const { resolve } = require('path')

const API_RESPONSES_FOLDER = resolve(__dirname, 'api-data')
const proxy = {
  'GET /meters': (req, res) => {
    const { status } = req.query;

    try {
      const data = require(resolve(API_RESPONSES_FOLDER, 'meters.json'))

      if (status) {
        res.json(data.filter(m => m.status_text === status))
      } else {
        res.json(data)
      }
    } catch (e) {
      console.error(`please add a meters.json file to ${API_RESPONSES_FOLDER}`)
    }
  },
  'GET /meters/:id': (req, res) => {
    const { id } = req.params;

    try {
      const data = require(resolve(API_RESPONSES_FOLDER, 'meters.json'))
      const meter = data.find(m => m.meter_id === id)

      if (meter) {
        res.json(meter)
      } else {
        res.status(404).json({
          message: 'meter not found'
        })
      }
    } catch (e) {
      console.error(`please add a meters.json file to ${API_RESPONSES_FOLDER}`)
    }
  },
  'GET /junctions': (req, res) => {
    try {
      const data = require(resolve(API_RESPONSES_FOLDER, 'junctions.json'))
      res.json(data)
    } catch (e) {
      console.error(`please add a junctions.json file to ${API_RESPONSES_FOLDER}`)
    }
  },
  'GET /junctions/:id': (req, res) => {
    const { id } = req.params;

    try {
      const data = require(resolve(API_RESPONSES_FOLDER, 'junctions.json'))
      const meter = data.find(j => j.junction_id === id)

      if (meter) {
        res.json(meter)
      } else {
        res.status(404).json({
          message: 'junction not found'
        })
      }
    } catch (e) {
      console.error(`please add a junctions.json file to ${API_RESPONSES_FOLDER}`)
    }
  }
}

module.exports = delay(proxy, 1000)
