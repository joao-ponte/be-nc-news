const app = require('../../app/app')
const request = require('supertest')
const endpoints = require('../../endpoints.json')

describe('GET /api', () => {
  it('should return a JSON object describing all available endpoints', async () => {
    const res = await request(app).get('/api')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(endpoints)
  })
})

describe('Invalid path handling', () => {
  it('should return 404 for an invalid path', async () => {
    const res = await request(app).get('/api/monkeys')
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toBe('Not found')
  })
})