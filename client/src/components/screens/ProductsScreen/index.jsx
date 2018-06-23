import React from 'react'
import propTypes from 'prop-types'

// Hard coded products list.
const productsList = [
  {
    category: 't-shirts',
    items: [
      {
        id: 1,
        uri: 'https://source.unsplash.com/random/500x598',
        name: 'Product 1',
        price: 342.99,
        discount: 32.99,
      },
      {
        id: 3,
        uri: 'https://source.unsplash.com/random/500x598',
        name: 'Product 1',
        price: 821.99,
        discount: 38.13,
      },
      {
        id: 4,
        uri: 'https://source.unsplash.com/random/500x598',
        name: 'Product 1',
        price: 342.99,
        discount: 42.39,
        category: 't-shirts',
      },
    ],
  },
  {
    category: 'action figures',
    items: [
      {
        id: 2,
        uri: 'https://source.unsplash.com/random/500x598',
        name: 'Product 1',
        price: 432.99,
        discount: 25.99,
      },
    ],
  },
]

const generateProductGroup = ({ category, items }) => {
  const products = items.slice(0, 3)

  return (
    <div className="my-4">
      <h3>{category}</h3>
      <div className="card-deck">
        <div className="card">
          <img className="card-img-top" src="..." alt="Card" />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              This is a wider card with supporting text below as a natural
              lead-in to additional content. This content is a little bit
              longer.
            </p>
          </div>
          <div className="card-footer">
            <small className="text-muted">Last updated 3 mins ago</small>
          </div>
        </div>
        <div className="card">
          <img className="card-img-top" src="..." alt="Card" />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              This card has supporting text below as a natural lead-in to
              additional content.
            </p>
          </div>
          <div className="card-footer">
            <small className="text-muted">Last updated 3 mins ago</small>
          </div>
        </div>
        <div className="card">
          <img className="card-img-top" src="..." alt="Card" />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              This is a wider card with supporting text below as a natural
              lead-in to additional content. This card has even longer content
              than the first to show that equal height action.
            </p>
          </div>
          <div className="card-footer">
            <small className="text-muted">Last updated 3 mins ago</small>
          </div>
        </div>
      </div>
    </div>
  )
}

generateProductGroup.propTypes = {
  category: propTypes.string.isRequired,
  items: propTypes.shape({
    id: propTypes.number.isRequired,
    uri: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    price: propTypes.number.isRequired,
    discount: propTypes.number.isReqired,
  }).isRequired,
}

const ProductsScreen = () => (
  <div className="container">
    {productsList.map(category => generateProductGroup(category))}
  </div>
)

export default ProductsScreen
