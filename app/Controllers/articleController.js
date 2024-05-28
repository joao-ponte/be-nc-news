const { fetchArticleByID } = require('../Model/articleModel')

exports.getArticleByID = async (req, res, next) => {
    try {
        const { article_id} = req.params
        console.log(article_id)
        const article = await fetchArticleByID(article_id)
        res.status(200).send(article)
    }
    catch {
        next(error)
    }
}