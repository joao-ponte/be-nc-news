const db = require('../../db/connection')

exports.fetchAllUsers = async () => {
  const result = await db.query(`
  SELECT username, name, avatar_url FROM users`)
  return result.rows
}

exports.fetchUserByUsername = async (username) => {
  const result = await db.query(
    `
    SELECT * FROM users 
    WHERE username = $1`,
    [username]
  )
  return result.rows[0]
}
