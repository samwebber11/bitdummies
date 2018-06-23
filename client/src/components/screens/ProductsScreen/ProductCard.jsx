import React from 'react'
import propTypes from 'prop-types'

const ProductCard = props => {
  const { uri, name, price, discount } = props.product

  return (
    <div className="card" style={{ maxWidth: '20rem' }}>
      <img className="card-img-top" src={uri} alt="Product card" />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p>${price}</p>
        <p className="text-success">-${discount}</p>
      </div>
      <div className="card-footer">
        <small className="text-muted">Last updated 3 mins ago</small>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: propTypes.shape({
    uri: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    price: propTypes.number.isRequired,
    discount: propTypes.number.isReqired,
  }).isRequired,
}

export default ProductCard
