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

describe('GET /api/articles/:article_id', () => {
  it('should return an article by its ID with status code 200', async () => {
    const articleId = 1
    const res = await request(app).get(`/api/articles/${articleId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(15)
  })

  it('should return an article by its ID with all properties listed', async () => {
    const articleId = 1
    const res = await request(app).get(`/api/articles/${articleId}`)

    expect(res.body).toHaveProperty('title')
    expect(res.body).toHaveProperty('author')
    expect(res.body).toHaveProperty('article_id')
    expect(res.body).toHaveProperty('body')
    expect(res.body).toHaveProperty('topic')
    expect(res.body).toHaveProperty('created_at')
    expect(res.body).toHaveProperty('votes')
    expect(res.body).toHaveProperty('article_img_url')
  })
})
