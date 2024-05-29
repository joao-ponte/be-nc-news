const { fetchCommentsByArticleID } = require('../Model/commentModel')

exports.getCommentsByArticleID = async (req, res, next) => {
  try {
    const { article_id } = req.params
    if (isNaN(article_id)) {
      return res.status(400).send({ message: 'Bad request.' })
    }
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
