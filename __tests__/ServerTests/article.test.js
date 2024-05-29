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
  })

  it('should return an article by its ID with all properties listed', async () => {
    const articleId = 1
    const res = await request(app).get(`/api/articles/${articleId}`)
    const expectedProperties = [
      'title',
      'author',
      'article_id',
      'body',
      'topic',
      'created_at',
      'votes',
      'article_img_url',
    ]

    expectedProperties.forEach((property) => {
      expect(res.body[property]).toBeDefined()
    })
  })
})

describe('Invalids paths', () => {
  it('should return 404 for article_id that does not exist in the database (e.g., /9999999)', async () => {
    const res = await request(app).get(`/api/articles/9999999`)
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Article not found.')
  })

  it('should return 400 for a bad article_id (e.g., /dog)', async () => {
    const res = await request(app).get('/api/articles/dog')
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Bad request.')
  })
})

describe('GET /api/articles', () => {
  it('should return an array of articles with status code 200', async () => {
    const res = await request(app).get('/api/articles')
    expect(res.statusCode).toBe(200)

    const expectedProperties = [
      'author',
      'title',
      'article_id',
      'topic',
      'created_at',
      'votes',
      'article_img_url',
      'comment_count',
    ]

    res.body.forEach((article) => {
      expectedProperties.forEach((property) => {
        expect(article).toHaveProperty(property)
      })
      expect(article).not.toHaveProperty('body')
    })
  })
})