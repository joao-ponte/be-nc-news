const { fetchCommentsByArticleID } = require('../Model/commentModel')
const {checkExists} = require('../Model/utilsModel')

exports.getCommentsByArticleID = async (req, res, next) => {
  try {
    const { article_id } = req.params
    if (isNaN(article_id)) {
      return res.status(400).send({ message: 'Bad request.' })
    }
    const existID = await checkExists('articles', 'article_id', article_id)
    console.log(existID)
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
