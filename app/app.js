const express = require('express')
const { getTopics } = require('./Controllers/topicController')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'Internal Error' })
})

module.exports = app
