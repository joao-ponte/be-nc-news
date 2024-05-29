const db = require('../../db/connection')

exports.fetchCommentsByArticleID = async (article_id) => {
  const result = await db.query(
    `
      SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
    `,
    [article_id]
  )

  return result.rows
}