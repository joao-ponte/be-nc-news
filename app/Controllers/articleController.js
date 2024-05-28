const { fetchArticleByID } = require('../Model/articleModel')

exports.getArticleByID = async (req, res, next) => {
  try {
    const { article_id } = req.params
    const article = await fetchArticleByID(article_id)
    res.status(200).send(article)
  } catch {
    next(error)
  }
}
