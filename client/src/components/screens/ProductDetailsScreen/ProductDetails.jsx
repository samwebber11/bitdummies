import React from 'react'
import propTypes from 'prop-types'

const ProductDetails = ({ product }) =>
  product.constructor === Object && Object.keys(product).length !== 0 ? (
    <div>
      <h3>{product.name}</h3>
      <p style={{ textDecoration: 'line-through' }}>${product.actualPrice}</p>
      <p className="text-success">${product.discountedPrice}</p>
      {product.description}
      <hr />
      <h6>Select Size</h6>
      <div className="col-md-2 d-flex justify-content-between">
        {product.size.map(size => (
          <button
            className="btn btn-xs btn-outline-dark rounded-circle"
            key={size.label}
          >
            {size.label}
          </button>
        ))}
      </div>
      <hr />
      <button className="btn btn-success">Next &#8594;</button>
      <hr />
      <h6 className="text-muted">Product Details</h6>
      <p>Lorem ipsum dolor sit amet.</p>
    </div>
  ) : (
    <div>Loading...</div>
  )

ProductDetails.propTypes = {
  product: propTypes.shape({
    name: propTypes.string,
    category: propTypes.string,
    size: propTypes.arrayOf(
      propTypes.shape({
        label: propTypes.string.isRequired,
        quantityAvailable: propTypes.number.isRequired,
      })
    ),
    description: propTypes.string,
    actualPrice: propTypes.number,
    discount: propTypes.number,
    discountedPrice: propTypes.number,
    tax: propTypes.number,
    imagePath: propTypes.arrayOf(propTypes.string),
    delicacy: propTypes.string,
  }),
}

ProductDetails.defaultProps = {
  product: {
    name: '',
    category: '',
    size: [],
    description: '',
    actualPrice: null,
    discount: null,
    discountedPrice: null,
    tax: null,
    imagePath: [],
    delicacy: '',
  },
}

export default ProductDetails
