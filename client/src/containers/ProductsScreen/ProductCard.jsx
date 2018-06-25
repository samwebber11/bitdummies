import React from 'react'
import propTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ProductCard = props => {
  const {
    id,
    name,
    actualPrice,
    discount,
    discountedPrice,
    image,
  } = props.product

  return (
    <Link style={{ all: 'initial' }} to={`/products/${id}`}>
      <div className="card" style={{ maxWidth: '20rem' }}>
        <img className="card-img-top" src={image} alt="Product card" />
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h5 className="card-title">{name}</h5>
            <p className="text-danger small">
              {discount ? `${discount}% OFF` : ''}
            </p>
          </div>
          <p style={{ textDecoration: 'line-through' }}>
            ${actualPrice.toFixed(2)}
          </p>
          <p className="text-success">
            -${(actualPrice - discountedPrice).toFixed(2)}
          </p>
          <p>${discountedPrice}</p>
        </div>
        <button className="btn btn-success">Add to cart</button>
      </div>
    </Link>
  )
}

ProductCard.propTypes = {
  product: propTypes.shape({
    id: propTypes.number.isRequired,
    name: propTypes.string.isRequired,
    actualPrice: propTypes.number.isRequired,
    discount: propTypes.number,
    discountedPrice: propTypes.number.isRequired,
    image: propTypes.string.isRequired,
  }).isRequired,
}

export default ProductCard
