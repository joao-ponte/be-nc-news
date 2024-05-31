const express = require('express')
const {
  getAllUsers,
  getUserByUsername,
} = require('./Controllers/userController')
const { getTopics } = require('./Controllers/topicController')
const {
  getArticleByID,
  getAllArticles,
  patchArticleVotes,
} = require('./Controllers/articleController')
const {
  getCommentsByArticleID,
  addCommentToArticle,
  deleteCommentByID,
  patchCommentVotes,
} = require('./Controllers/commentController')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id', getArticleByID)
app.get('/api/articles/:article_id/comments', getCommentsByArticleID)
app.post('/api/articles/:article_id/comments', addCommentToArticle)
app.patch('/api/articles/:article_id', patchArticleVotes)
app.delete('/api/comments/:comment_id', deleteCommentByID)
app.patch('/api/comments/:comment_id', patchCommentVotes)
app.get('/api/users', getAllUsers)
app.get('/api/users/:username', getUserByUsername)

const endpoints = require('../endpoints.json')
app.get('/api', (req, res) => {
  res.status(200).send(endpoints)
})

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    return res.status(400).send({ message: 'Bad request' })
  } else if (err.code === '23503') {
    return res.status(404).send({ message: 'Resource not found' })
  }
  next(err)
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
