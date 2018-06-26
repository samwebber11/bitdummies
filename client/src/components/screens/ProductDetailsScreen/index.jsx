import React, { Component } from 'react'
import propTypes from 'prop-types'

import ProductPhotosCarousel from './ProductPhotosCarousel'
import ProductDetails from './ProductDetails'

class ProductDetailsScreen extends Component {
  state = {
    autoplay: false,
  }

  componentDidMount() {
    // Fetch product details here.
  }

  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6">
            <ProductPhotosCarousel autoplay={this.state.autoplay} />
          </div>
          <div className="col-md-6">
            <ProductDetails id={this.props.match.params.id} />
          </div>
        </div>
      </div>
    )
  }
}

ProductDetailsScreen.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default ProductDetailsScreen
