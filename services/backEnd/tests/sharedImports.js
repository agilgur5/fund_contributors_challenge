const { makeFetch } = require('supertest-fetch')

const { app, pageSize, contributors } = require('../main.js')
const fetch = makeFetch(app)

module.exports = { fetch, pageSize, contributors }
