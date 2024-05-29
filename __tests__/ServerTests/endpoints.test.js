const app = require('../../app/app')
const request = require('supertest')
const endpoints = require('../../endpoints.json')

describe('GET /api', () => {
  it('should return a JSON object describing all available endpoints', async () => {
    const { body } = await request(app).get('/api').expect(200)
    expect(body).toEqual(endpoints)
  })
})

describe('Invalid path handling', () => {
  it('should return 404 for an invalid path', async () => {
    const { body } = await request(app).get('/api/monkeys').expect(404)
    expect(body.message).toBe('Invalid path')
  })
})
