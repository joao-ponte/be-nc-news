const { fetchAllUsers, fetchUserByUsername } = require('../Model/userModel')
const {checkExists} = require('../Model/utilsModel')

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers()
    res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params
    await checkExists('users', 'username', username)
    const user = await fetchUserByUsername(username)
    res.status(200).send(user)
  } catch (error) {
    next(error)
  }
}
