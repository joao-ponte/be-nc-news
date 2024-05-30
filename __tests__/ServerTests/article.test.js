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
    await request(app).get(`/api/articles/${articleId}`).expect(200)
  })

  it('should return an article by its ID with all properties listed', async () => {
    const articleId = 1
    const { body } = await request(app).get(`/api/articles/${articleId}`)
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
      expect(body[property]).toBeDefined()
    })
  })
})

describe('Invalid paths', () => {
  it('should return 404 for article_id that does not exist in the database (e.g., /9999999)', async () => {
    const { body } = await request(app).get(`/api/articles/9999999`).expect(404)
    expect(body.message).toBe('Resource not found')
  })

  it('should return 400 for a bad article_id (e.g., /dog)', async () => {
    const { body } = await request(app).get('/api/articles/dog').expect(400)
    expect(body.message).toBe('Bad request')
  })
})

describe('GET /api/articles', () => {
  it('should return an array of articles with status code 200', async () => {
    const { body } = await request(app).get('/api/articles').expect(200)
    expect(body).toHaveLength(13)
    expect(body).toBeSortedBy('created_at', { descending: true })

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

    body.forEach((article) => {
      expectedProperties.forEach((property) => {
        expect(article).toHaveProperty(property)
      })
      expect(article).not.toHaveProperty('body')
    })
  })
})

describe('GET /api/articles (topic query)', () => {
  it('200: should return an array of articles filtered by topic', async () => {
    const { body } = await request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)

    expect(body).toHaveLength(12)
    body.forEach((article) => {
      expect(article.topic).toBe('mitch')
    })
  })

  it('should verify that each article in the response has all expected properties', async () => {
    const { body } = await request(app).get('/api/articles').expect(200)
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
    body.forEach((article) => {
      expectedProperties.forEach((property) => {
        expect(article).toHaveProperty(property)
      })
    })
  })

  it('404: should return 404 if the topic does not exist', async () => {
    const { body } = await request(app)
      .get('/api/articles?topic=invalid_topic')
      .expect(404)
    expect(body.message).toBe('Resource not found')
  })

  it('should return an empty array if no articles match the specified topic', async () => {
    const { body } = await request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
    expect(body).toHaveLength(0)
  })
})

describe('PATCH /api/articles/:article_id', () => {
  it('should update the votes of the specified article and return the updated article with status code 200', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)

    expect(body).toHaveProperty('article_id', 1)
    expect(body.votes).toBe(101)
  })

  it('should update the votes of the specified article and return the updated article with status code 200', async () => {
    const { body: initialArticle } = await request(app).get('/api/articles/1')
    const initialVotes = initialArticle.votes

    await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)

    const { body: updatedArticle } = await request(app).get('/api/articles/1')
    const updatedVotes = updatedArticle.votes

    expect(updatedVotes).toBe(initialVotes + 1)
  })

  it('should decrease the votes of the specified article and return the updated article with status code 200', async () => {
    const { body: initialArticle } = await request(app).get('/api/articles/1')
    const initialVotes = initialArticle.votes

    await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -1 })
      .expect(200)

    const { body: updatedArticle } = await request(app).get('/api/articles/1')
    const updatedVotes = updatedArticle.votes

    expect(updatedVotes).toBe(initialVotes - 1)
  })

  it('should return 400 Bad Request if the article_id is not a number', async () => {
    const { body } = await request(app)
      .patch('/api/articles/dog')
      .send({ inc_votes: 1 })
      .expect(400)

    expect(body.message).toBe('Bad request')
  })

  it('should return 400 Bad Request if inc_votes is not a number', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'one' })
      .expect(400)

    expect(body.message).toBe('Bad request')
  })

  it('should return a 400 Bad Request error if inc_votes is missing', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)

    expect(body.message).toBe('inc_votes is required.')
  })

  it('should return 404 Not Found if the article_id does not exist', async () => {
    const { body } = await request(app)
      .patch('/api/articles/999999')
      .send({ inc_votes: 1 })
      .expect(404)

    expect(body.message).toBe('Resource not found')
  })
})
