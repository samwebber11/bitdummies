import React, { Component } from 'react'

import ProductPhotosCarousel from './ProductPhotosCarousel'

class ProductDetailsScreen extends Component {
  state = {
    autoplay: false,
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-4 mt-3">
          <ProductPhotosCarousel autoplay={this.state.autoplay} />
        </div>
      </div>
    )
  }
}

export default ProductDetailsScreen
