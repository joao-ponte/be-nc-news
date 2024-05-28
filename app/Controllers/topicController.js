const { fetchTopics } = require('../Model/topicModel.js')

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics()
    console.log(topics)
    res.status(200).send(topics)
  } catch (error) {
    next(error)
  }
}
