import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'https://localhost:3001/graphql',
  credentials: 'include',
})

export default client
