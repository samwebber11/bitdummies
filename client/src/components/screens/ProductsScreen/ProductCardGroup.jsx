import React from 'react'
import propTypes from 'prop-types'

import ProductCard from './ProductCard'

const ProductCardGroup = props => {
  const { category } = props.products
  const products = props.products.items.slice(0, 3)

  return (
    <div className="my-4">
      <h3>{category}</h3>
      <div className="card-deck">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

ProductCardGroup.propTypes = {
  products: propTypes.shape({
    category: propTypes.string.isRequired,
    items: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.number.isRequired,
        uri: propTypes.string.isRequired,
        name: propTypes.string.isRequired,
        price: propTypes.number.isRequired,
        discount: propTypes.number.isReqired,
      })
    ).isRequired,
  }).isRequired,
}

export default ProductCardGroup
