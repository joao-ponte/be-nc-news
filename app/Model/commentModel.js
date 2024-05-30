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

exports.addComment = async (article_id, username, body) => {
  const result = await db.query(
    `
      INSERT INTO comments (article_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
    [article_id, username, body]
  )
  return result.rows[0]
}

exports.deleteComment = async (comment_id) => {
  await db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
}
