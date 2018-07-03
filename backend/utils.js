// Performs the same operation as object spread.
export const merge = (prev, next) => Object.assign({}, prev, next)

// Creates a new object that is a subset of another object.
export const pick = (object, keys) => {
  const newObject = {}
  keys.forEach(key => {
    newObject[key] = object[key]
  })
  return newObject
}
