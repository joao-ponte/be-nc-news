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
    const { body } = await request(app)
      .get('/api/articles/1/comments')
      .expect(200)
    expect(body).toHaveLength(11)
    const expectedProperties = [
      'comment_id',
      'votes',
      'created_at',
      'author',
      'body',
      'article_id',
    ]

    body.forEach((comment) => {
      expectedProperties.forEach((property) => {
        expect(comment).toHaveProperty(property)
      })
    })
  })

  it('should return comments sorted by created_at in descending order', async () => {
    const { body } = await request(app).get('/api/articles/1/comments')
    expect(body).toBeSortedBy('created_at', { descending: true })
  })

  it('404: should return 404 if article does not exist', async () => {
    const { body } = await request(app)
      .get('/api/articles/99999/comments')
      .expect(404)
    expect(body.message).toBe('Article not found.')
  })

  it('400: should return 400 for an invalid article_id', async () => {
    const { body } = await request(app)
      .get('/api/articles/invalid/comments')
      .expect(400)
    expect(body.message).toBe('Bad request.')
  })
})

describe('POST /api/articles/:article_id/comments', () => {
  it('should add a comment to the specified article and return the new comment with status code 201', async () => {
    const { body: initialComments } = await request(app).get(
      '/api/articles/1/comments'
    )
    const initialCommentsCount = initialComments.length

    const { body: newComment } = await request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'butter_bridge', body: 'Test comment' })
      .expect(201)

    const { body: updatedComments } = await request(app).get(
      '/api/articles/1/comments'
    )
    const updatedCommentsCount = updatedComments.length

    expect(updatedCommentsCount).toBe(initialCommentsCount + 1)
    expect(newComment).toHaveProperty('comment_id')
    expect(newComment).toHaveProperty('article_id', 1)
    expect(newComment).toHaveProperty('author', 'butter_bridge')
    expect(newComment).toHaveProperty('body', 'Test comment')
  })

  it('should return a 400 Bad Request error if username is missing', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({ body: 'Test comment' })
      .expect(400)

    expect(body.message).toBe('Username and body are required.')
  })

  it('should return a 400 Bad Request error if body is missing', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'butter_bridge' })
      .expect(400)

    expect(body.message).toBe('Username and body are required.')
  })

  it('should return a 400 Bad Request error if both username and body are missing', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({})
      .expect(400)

    expect(body.message).toBe('Username and body are required.')
  })

  it('should return a 400 Bad Request error if the data types of request parameters are incorrect', async () => {
    const { body } = await request(app)
      .post(`/api/articles/dog/comments`)
      .send({ username: 'butter_bridge', body: 'Test comment' })
      .expect(400)

    expect(body.message).toBe('Bad request.')
  })

  it('should return a 404 Not Found error if the article ID does not exist', async () => {
    const { body } = await request(app)
      .post(`/api/articles/999999/comments`)
      .send({ username: 'butter_bridge', body: 'Test comment' })
      .expect(404)

    expect(body.message).toBe('Resource not found')
  })
})
