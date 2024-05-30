const db = require('../../db/connection')

exports.fetchArticleByID = async (article_id) => {
  const result = await db.query(
    `
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `,
    [article_id]
  )

  return result.rows[0]
}

exports.fetchAllArticles = async (topic) => {
  let queryStr = `
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `
  const queryParams = []

  if (topic) {
    queryStr += `WHERE articles.topic = $1 `
    queryParams.push(topic)
  }

  queryStr += `
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
`
  const result = await db.query(queryStr, queryParams)
  return result.rows
}

exports.updateArticleVotes = async (article_id, inc_votes) => {
  const result = await db.query(
    `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
    [inc_votes, article_id]
  )
  return result.rows[0]
}
