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
  try {
    const result = await db.query(
      `
        INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [article_id, username, body]
    )
    if (result.rows.length === 0) {
      throw new Error('Failed to insert comment')
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}
