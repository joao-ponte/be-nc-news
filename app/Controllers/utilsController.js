exports.isValidNumber = (param) => {
  if (!isNaN(param) && param) {
    return true
  } else {
    throw new Error('Bad request.')
  }
}
