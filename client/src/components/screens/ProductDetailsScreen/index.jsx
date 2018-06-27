import React, { Component } from 'react'
import propTypes from 'prop-types'

import ProductPhotosCarousel from './ProductPhotosCarousel'
import ProductDetails from './ProductDetails'
import client from '../../../apollo-client/client'
import { getProductDetails } from '../../../queries/'

class ProductDetailsScreen extends Component {
  state = {
    autoplay: false,
    product: {},
  }

  componentDidMount() {
    const { id } = this.props.match.params
    client
      .query({
        query: getProductDetails,
        variables: {
          id,
        },
      })
      .then(response => {
        this.setState({ product: response.data.product })
      })
  }

  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6">
            <ProductPhotosCarousel
              autoplay={this.state.autoplay}
              images={this.state.product.imagePath}
            />
          </div>
          <div className="col-md-6">
            <ProductDetails product={this.state.product} />
          </div>
        </div>
      </div>
    )
  }
}

ProductDetailsScreen.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string,
    }),
  }).isRequired,
}

export default ProductDetailsScreen
