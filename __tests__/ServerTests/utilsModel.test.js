const db = require('../../db/connection')
const seed = require('../../db/seeds/seed')
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require('../../db/data/test-data/index')
const { checkExists } = require('../../app/Model/utilsModel')

beforeAll(() => seed({ topicData, userData, articleData, commentData }))
afterAll(() => db.end())

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
