const db = require('../../db/connection')

exports.fetchArticleByID = async (article_id) => {
    const result = await db.query(`
    SELECT * FROM articles WHERE article_id = $1
    `, [article_id])
    if (result.rows.length === 0) {
    throw { status: 404, message: `Article with ID ${article_id} not found`}
    }
    return result.rows[0]    
}
