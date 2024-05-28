const express = require('express')
const { getTopics } = require('./Controllers/topicController')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

const endpoints = require('../endpoints.json')
app.get('/api', (res) => {
  res.status(200).send(endpoints)
})

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'Internal Server Error' })
})

module.exports = app
