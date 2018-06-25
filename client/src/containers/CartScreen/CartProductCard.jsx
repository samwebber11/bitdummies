import React from 'react'
import propTypes from 'prop-types'

const CartProductCard = ({ product }) => (
  <div className="card">
    <div className="row">
      <div className="col-md-4">
        <img className="card-img" src={product.imagePath} alt="" />
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the content.
              </p>
              <button className="btn btn-outline-danger">
                Remove from cart
              </button>
            </div>
            <div className="col-md-4">
              <p
                className="card-text text-right"
                style={{ textDecoration: 'line-through' }}
              >
                ${product.actualPrice}
              </p>
              <p className="card-text text-right text-success">
                -${((product.actualPrice * product.discount) / 100).toFixed(2)}
              </p>
              <p className="card-text text-right">${product.discountedPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

CartProductCard.propTypes = {
  product: propTypes.shape({
    id: propTypes.number.isRequired,
    name: propTypes.string.isRequired,
    imagePath: propTypes.string.isRequired,
    actualPrice: propTypes.number.isRequired,
    discount: propTypes.number,
    discountedPrice: propTypes.number,
    tax: propTypes.number,
  }).isRequired,
}

export default CartProductCard
