import React from 'react'

const ProductDetails = () => (
  <div>
    <h3>Product Name</h3>
    <p>$49.99</p>
    <hr />
    <h6>Select Size</h6>
    <div className="col-md-2 d-flex justify-content-between">
      <button className="btn btn-xs btn-outline-dark rounded-circle">S</button>
      <button className="btn btn-xs btn-outline-dark rounded-circle">M</button>
      <button className="btn btn-xs btn-outline-dark rounded-circle">L</button>
    </div>
    <hr />
    <button className="btn btn-success">Next &#8594;</button>
    <hr />
    <h6 className="text-muted">Product Details</h6>
    <p>Lorem ipsum dolor sit amet.</p>
  </div>
)

export default ProductDetails
