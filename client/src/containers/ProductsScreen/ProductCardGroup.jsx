import React from 'react'
import propTypes from 'prop-types'

import ProductCard from './ProductCard'

const ProductCardGroup = ({ productGroup }) => {
  const { category } = productGroup
  const products = productGroup.products.slice(0, 3)

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
  productGroup: propTypes.shape({
    category: propTypes.string.isRequired,
    products: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.number.isRequired,
        name: propTypes.string.isRequired,
        actualPrice: propTypes.number.isRequired,
        discount: propTypes.number,
        image: propTypes.string.isRequired,
        discountedPrice: propTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default ProductCardGroup
