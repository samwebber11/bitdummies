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

const fetchProducts = gql`
  {
    products {
      id
      name
      category
      size {
        label
        quantityAvailable
      }
      description
      actualPrice
      discount
      discountedPrice
      tax
      imagePath
      delicacy
    }
  }
`

const getProductDetails = gql`
  query($id: ID!) {
    product(id: $id) {
      id
      name
      category
      size {
        label
        quantityAvailable
      }
      description
      actualPrice
      discount
      tax
      discountedPrice
      imagePath
      delicacy
    }
  }
`

export { fetchSomething, fetchProducts, getProductDetails }
