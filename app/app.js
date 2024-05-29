const express = require('express')
const { getTopics } = require('./Controllers/topicController')
const {
  getArticleByID,
  getAllArticles,
  patchArticleVotes,
} = require('./Controllers/articleController')
const {
  getCommentsByArticleID,
  addCommentToArticle,
} = require('./Controllers/commentController')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id', getArticleByID)
app.get('/api/articles/:article_id/comments', getCommentsByArticleID)
app.post('/api/articles/:article_id/comments', addCommentToArticle)
app.patch('/api/articles/:article_id', patchArticleVotes)

const endpoints = require('../endpoints.json')
app.get('/api', (req, res) => {
  res.status(200).send(endpoints)
})

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message })
  } else {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})

app.use((req, res, next) => {
  res.status(404).send({ message: 'Invalid path' })
})

module.exports = app
