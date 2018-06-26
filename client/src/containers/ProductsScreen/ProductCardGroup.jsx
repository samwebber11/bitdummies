import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ProductCard from './ProductCard'
import { addItemToCart } from '../../actions/cartActions'

const ProductCardGroup = props => {
  const { category } = props.productGroup
  const products = props.productGroup.products.slice(0, 3)

  return (
    <div className="my-4">
      <h3>{category}</h3>
      <div className="card-deck">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            handleClick={event => {
              event.preventDefault()
              props.addItemToCart(product)
            }}
          />
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
        imagePath: propTypes.string.isRequired,
        discountedPrice: propTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addItemToCart }, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(ProductCardGroup)
