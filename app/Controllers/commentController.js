const {
  fetchCommentsByArticleID,
  addComment,
  deleteComment,
  updateCommentVotes,
} = require('../Model/commentModel')
const { checkExists } = require('../Model/utilsModel')

exports.getCommentsByArticleID = async (req, res, next) => {
  try {
    const { article_id } = req.params
    await checkExists('articles', 'article_id', article_id)
    const comments = await fetchCommentsByArticleID(article_id)
    res.status(200).send(comments)
  } catch (error) {
    next(error)
  }
}

exports.addCommentToArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params
    const { username, body } = req.body

    if (!username || !body) {
      return res
        .status(400)
        .send({ message: 'Username and body are required.' })
    }
    const newComment = await addComment(article_id, username, body)
    res.status(201).send(newComment)
  } catch (error) {
    next(error)
  }
}

exports.patchCommentVotes = async (req, res, next) => {
  try {
    const { comment_id } = req.params
    const { inc_votes } = req.body

    if (inc_votes === undefined) {
      return res.status(400).send({ message: 'inc_votes is required.' })
    }

    await checkExists('comments', 'comment_id', comment_id)
    const updatedComment = await updateCommentVotes(comment_id, inc_votes)
    res.status(200).send(updatedComment)
  } catch (error) {
    next(error)
  }
}

exports.deleteCommentByID = async (req, res, next) => {
  try {
    const { comment_id } = req.params

    await checkExists('comments', 'comment_id', comment_id)
    await deleteComment(comment_id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
