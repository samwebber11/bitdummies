import { gql } from 'apollo-boost'

const fetchSomething = gql`
  {
    books {
      name
      genre
      author {
        name
      }
    }
    authors {
      name
    }
  }
`

export default fetchSomething
