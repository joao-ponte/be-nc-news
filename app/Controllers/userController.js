const { fetchAllUsers } = require('../Model/userModel')

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers()
    res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}
