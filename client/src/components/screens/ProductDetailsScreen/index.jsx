import React, { Component } from 'react'
import propTypes from 'prop-types'

import ProductPhotosCarousel from './ProductPhotosCarousel'
import ProductDetails from './ProductDetails'

class ProductDetailsScreen extends Component {
  state = {
    autoplay: false,
  }

  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6">
            <ProductPhotosCarousel autoplay={this.state.autoplay} />
          </div>
          <div className="col-md-6">
            <ProductDetails product={this.props.product} />
          </div>
        </div>
      </div>
    )
  }
}

ProductDetailsScreen.propTypes = {
  product: propTypes.objectOf({
    id: propTypes.string,
  }).isRequired,
}

export default ProductDetailsScreen
