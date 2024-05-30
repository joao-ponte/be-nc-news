const {
  fetchArticleByID,
  fetchAllArticles,
  updateArticleVotes,
} = require('../Model/articleModel')
const { checkExists } = require('../Model/utilsModel')

exports.getArticleByID = async (req, res, next) => {
  try {
    const { article_id } = req.params

    await checkExists('articles', 'article_id', article_id)
    const article = await fetchArticleByID(article_id)
    res.status(200).send(article)
  } catch (error) {
    next(error)
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

exports.patchArticleVotes = async (req, res, next) => {
  try {
    const { article_id } = req.params
    const { inc_votes } = req.body

    if (inc_votes === undefined) {
      return res.status(400).send({ message: 'inc_votes is required.' })
    }

    await checkExists('articles', 'article_id', article_id)
    const updatedArticle = await updateArticleVotes(article_id, inc_votes)
    res.status(200).send(updatedArticle)
  } catch (error) {
    next(error)
  }
}
