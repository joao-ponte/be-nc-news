const {
  fetchCommentsByArticleID,
  addComment,
} = require('../Model/commentModel')
const { checkExists } = require('../Model/utilsModel')

exports.getCommentsByArticleID = async (req, res, next) => {
  try {
    const { article_id } = req.params
    if (isNaN(article_id)) {
      return res.status(400).send({ message: 'Bad request.' })
    }
    await checkExists('articles', 'article_id', article_id)
    const comments = await fetchCommentsByArticleID(article_id)
    res.status(200).send(comments)
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).send({ message: 'Article not found.' })
    } else {
      return res.status(500).send({ message: 'Internal Server Error' })
    }
  }
}

exports.addCommentToArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params
    const { username, body } = req.body

    if (!username || !body) {
      return res.status(400).send({ message: 'Username and body are required.' })
    }
    const newComment = await addComment(article_id, username, body)
    console.log(newComment)
    res.status(201).send(newComment)
  } catch (error) {
    next(error)
  }
}
