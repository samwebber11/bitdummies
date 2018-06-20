import React, { Component } from 'react'
import propTypes from 'prop-types'

class ProductCard extends Component {
  state = {
    product: null,
  }

  componentDidMount = props => {
    // TODO: Fetch data about the product from the API server.
    const { data } = this.props.uri
    this.setState({ product: data })
  }

  render() {
    return this.state.product !== null ? (
      <div className="card">
        <img className="card-img-top" src="..." alt="Card" />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            This card has supporting text below as a natural lead-in to
            additional content.
          </p>
        </div>
        <div className="card-footer">
          <small className="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    ) : (
      <div>Loading...</div>
    )
  }
}

ProductCard.propTypes = {
  uri: propTypes.string,
}

ProductCard.defaultProps = {
  uri: '',
}

export default ProductCard
