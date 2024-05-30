const app = require('../../app/app')
const { checkExists } = require('../../app/Model/utilsModel')
const request = require('supertest')
const endpoints = require('../../endpoints.json')
const db = require('../../db/connection')
const seed = require('../../db/seeds/seed')
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../../db/data/test-data/index')

beforeEach(() => seed({ topicData, userData, articleData, commentData }))
afterAll(() => db.end())

describe('GET /api/articles/:article_id', () => {
  it('should return an article by its ID with status code 200', async () => {
    const articleId = 1
    await request(app).get(`/api/articles/${articleId}`).expect(200)
  })

  it('should return an article by its ID with all properties listed', async () => {
    const { body } = await request(app).get('/api/articles/1').expect(200)
    console.log(body)
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

    expectedProperties.forEach((property) => {
      expect(body).toHaveProperty(property)
    })
    expect(typeof body.comment_count).toBe('number')
  })
})

describe('GET /api/articles/:article_id (comment_count)', () => {
  it('should return an article by its ID with comment_count property', async () => {
    const { body } = await request(app).get('/api/articles/1').expect(200)
    expect(body).toHaveProperty('comment_count')
  })

  it('should return the correct comment count for the article', async () => {
    const { body } = await request(app).get('/api/articles/1').expect(200)
    expect(body.comment_count).toBe(11)
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
    expect(body.message).toBe('Resource not found')
  })

  it('400: should return 400 for an invalid article_id', async () => {
    const { body } = await request(app)
      .get('/api/articles/invalid/comments')
      .expect(400)
    expect(body.message).toBe('Bad request')
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
      .send({
        username: 'butter_bridge',
        body: 'Test comment',
        unnecessaryProperty: 'This should be ignored',
        anotherUnnecessaryProperty: 'This should also be ignored',
      })
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
    expect(newComment).not.toHaveProperty('unnecessaryProperty')
    expect(newComment).not.toHaveProperty('anotherUnnecessaryProperty')
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
    expect(body.message).toBe('Bad request')
  })

  it('should return a 404 Not Found error if the article ID does not exist', async () => {
    const { body } = await request(app)
      .post(`/api/articles/999999/comments`)
      .send({ username: 'butter_bridge', body: 'Test comment' })
      .expect(404)

    expect(body.message).toBe('Resource not found')
  })

  it('should return a 404 Not Found error if the provided username does not exist', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'non_existent_user', body: 'Test comment' })
      .expect(404)

    expect(body.message).toBe('Resource not found')
  })
})

describe('DELETE /api/comments/:comment_id', () => {
  it('should delete the comment with the given comment_id', async () => {
    await request(app).delete('/api/comments/1').expect(204)
  })

  it('should delete the comment with the given comment_id and update the number of comments', async () => {
    const { body: initialComments } = await request(app).get(
      '/api/articles/1/comments'
    )
    const initialCommentsCount = initialComments.length

    await request(app).delete('/api/comments/2').expect(204)

    const { body: updatedComments } = await request(app).get(
      '/api/articles/1/comments'
    )
    const updatedCommentsCount = updatedComments.length

    expect(updatedCommentsCount).toBe(initialCommentsCount - 1)
  })

  it('should return 404 if comment_id does not exist', async () => {
    const { body } = await request(app)
      .delete('/api/comments/99999')
      .expect(404)
    expect(body.message).toBe('Resource not found')
  })

  it('should return a 400 Bad Request error if comment_id parameter is not a valid number', async () => {
    const { body } = await request(app).delete('/api/comments/abc').expect(400)

    expect(body.message).toBe('Bad request')
  })
})

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

describe('GET /api/topics', () => {
  it('should return all topics', async () => {
    const { body } = await request(app).get('/api/topics').expect(200)
    expect(body).toHaveLength(3)

    body.forEach((topic) => {
      expect(topic).toHaveProperty('slug')
      expect(topic).toHaveProperty('description')
    })
  })
})

describe('GET /api/users', () => {
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

describe('Utility function: checkExists', () => {
  it('should resolve if the resource exists', async () => {
    await expect(
      checkExists('articles', 'article_id', 1)
    ).resolves.toBeUndefined()
  })

  it('should reject with a 404 error if the resource does not exist', async () => {
    await expect(checkExists('articles', 'article_id', 999999)).rejects.toEqual(
      {
        status: 404,
        message: 'Resource not found',
      }
    )
  })
})
