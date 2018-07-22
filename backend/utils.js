// Performs the same operation as object spread.
export const merge = (prev, next) => Object.assign({}, prev, next)

// Creates a new object that is a subset of another object.
export const pick = (object, keys) => {
  const newObject = {}
  keys.forEach(key => {
    if (object[key]) {
      newObject[key] = object[key]
    }
  })
  return newObject
}

// Shuffles the array.
export const shuffleArray = array => {
  const arr = [...array]

  for (let i = arr.length - 1; i > 0; i -= 1) {
    // Choose a random index between [0, arr.length - 1]
    const j = Math.floor(Math.random() * (i + 1))

    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  return arr
}

// Compares the values and sorts them
export function compareValues(key, order = 'asc') {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}
