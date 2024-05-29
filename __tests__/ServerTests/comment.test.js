const app = require('../../app/app')
const request = require('supertest')
const db = require('../../db/connection')
const seed = require('../../db/seeds/seed')
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../../db/data/test-data/index')

beforeAll(() => seed({ topicData, userData, articleData, commentData }))
afterAll(() => db.end())

describe('GET /api/articles/:article_id/comments', () => {
  it('200: should return an array of comments for the given article_id', async () => {
    const res = await request(app).get('/api/articles/1/comments')
    expect(res.statusCode).toBe(200)

    const expectedProperties = [
      'comment_id',
      'votes',
      'created_at',
      'author',
      'body',
      'article_id',
    ]

    res.body.forEach((comment) => {
      expectedProperties.forEach((property) => {
        expect(comment).toHaveProperty(property)
      })
    })
  })

  it('should return comments sorted by created_at in descending order', async () => {
    const res = await request(app).get('/api/articles/1/comments')
    expect(res.body).toBeSortedBy('created_at', { descending: true })
  })

  it('404: should return 404 if article does not exist', async () => {
    const res = await request(app).get('/api/articles/99999/comments')
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Article not found.')
  })

  it('400: should return 400 for an invalid article_id', async () => {
    const res = await request(app).get('/api/articles/invalid/comments')
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Bad request.')
  })
})
