/**
 * Function to convert an a params object to a string.
 * @param {object} params
 * @returns {String} params converted to string for usage in GraphQL.
 */
const paramsToString = params => {
  let paramString = ''
  if (params.constructor === Object && Object.keys(params).length) {
    const tmp = Object.entries(params).reduce((temp, currentEntry) => {
      // currentEntry is of the form: [key, value].
      let paramStr = currentEntry[1]
      if (paramStr !== '') {
        // If type of value is string, then it has to be escaped inside the query.
        if (typeof currentEntry[1] === 'string') {
          paramStr = `"${paramStr}"`
        }
        temp.push(`${currentEntry[0]}:${paramStr}`)
      }
      return temp
    }, [])

    if (tmp.length) {
      paramString = `(${tmp.join()})`
    }
  }
  return paramString
}

class ApiService {
  constructor() {
    this.apiUri = 'http://localhost:3001/graphql'
  }

  /**
   * Generic function to fetch the results for a query from the server.
   * @param {String} resource e.g. 'user'
   * @param {Object} params e.g. {id: "3"}
   * @param {String} fields e.g. 'name, age, orders {date, total}'
   */
  async graphQLQuery(resource, params, fields) {
    const query = `{${resource} ${paramsToString(params)} ${fields}}`
    const res = await fetch(this.apiUri, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify({ query }),
    })

    if (res.ok) {
      const body = await res.json()
      return body.data
    }
    throw new Error(res.status)
  }

  /**
   * Generic function to send a mutation to the server.
   * @param {String} mutationName e.g. 'addOrder'
   * @param {Object} params e.g. {id: "3"}
   * @param {String} fields e.g. 'date, total, user {name, age}'
   */
  async graphQLMutation(mutationName, params, fields) {
    const mutation = `mutation ${mutationName} ${paramsToString(
      params
    )} ${fields}`
    const res = await fetch(this.apiUri, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify({ mutation }),
    })

    if (res.ok) {
      const body = await res.json()
      return body.data
    }
    throw new Error(res.status)
  }
}

export default new ApiService()
