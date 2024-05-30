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

describe.only('GET /api/users', () => {
  it('200: should return an array of users with the correct properties', async () => {
    const { body } = await request(app).get('/api/users').expect(200)
    expect(body).toHaveLength(4)
    body.forEach((user) => {
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('avatar_url')
    })
  })
})
