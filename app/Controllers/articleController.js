const { fetchArticleByID, fetchAllArticles } = require('../Model/articleModel')

exports.getArticleByID = async (req, res, next) => {
  try {
    const { article_id } = req.params
    if (isNaN(article_id)) {
      return res.status(400).send({ message: 'Bad request.' })
    }
    const article = await fetchArticleByID(article_id)
    res.status(200).send(article)
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).send({ message: 'Article not found.' })
    } else {
      return res.status(500).send({ message: 'Internal Server Error' })
    }
  }
}

exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await fetchAllArticles()
    res.status(200).send(articles)
  } catch (error) {
    next(error)
  }
}
