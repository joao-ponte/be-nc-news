const { isValidNumber } = require('../../app/Controllers/utilsController')

describe('isValidNumber function', () => {
  it('should return true for a valid number', () => {
    const result = isValidNumber(123)
    expect(result).toBe(true)
  })

  it('should throw an error for an invalid number', () => {
    expect(() => {
      isValidNumber('abc')
    }).toThrow('Bad request.')
  })

  it('should throw an error for an empty parameter', () => {
    expect(() => {
      isValidNumber('')
    }).toThrow('Bad request.')
  })
})
