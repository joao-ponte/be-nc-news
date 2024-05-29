const express = require('express')
const { getTopics } = require('./Controllers/topicController')
const { getArticleByID, getAllArticles } = require('./Controllers/articleController')
const app = express()

app.get('/api/topics', getTopics)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id', getArticleByID)

const endpoints = require('../endpoints.json')
app.get('/api', (req, res) => {
  res.status(200).send(endpoints)
})

app.use((req, res, next) => {
  res.status(404).json({ message: 'Invalid path' })
})

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'Internal Server Error' })
})

module.exports = app
