import React from 'react'

const generateCartProductCards = ({ productImageUris }) =>
  productImageUris.map(uri => (
    <div className="card">
      <div className="row">
        <div className="col-md-4">
          <img className="card-img" src={uri} alt="" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the content.
                </p>
                <button className="btn btn-danger">Remove from cart</button>
              </div>
              <div className="col-md-4">
                <p className="card-text text-right">$49.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))

const productImageUris = [
  'https://source.unsplash.com/random/800x498',
  'https://source.unsplash.com/random/800x499',
  'https://source.unsplash.com/random/800x500',
  'https://source.unsplash.com/random/800x501',
  'https://source.unsplash.com/random/800x502',
]

const products = {
  productImageUris,
}

const CartProducts = () => generateCartProductCards(products)

export default CartProducts
