const db = require('../../db/connection')

exports.fetchArticleByID = async (article_id) => {
  try {
    const result = await db.query(
      `
    SELECT * FROM articles WHERE article_id = $1
    `,
      [article_id]
    )
    if (result.rows.length === 0) {
      throw { status: 404, message: `Article not found.` }
    }
    return result.rows[0]
  } catch (error) {
    throw error
  }
}
