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

describe('GET /api/topics', () => {
  it('should return all topics', async () => {
    const res = await request(app).get('/api/topics')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(3)

    res.body.forEach((topic) => {
      expect(topic).toHaveProperty('slug')
      expect(topic).toHaveProperty('description')
    })
  })
})
