import React, { Component } from 'react'

import ProductCardGroup from './ProductCardGroup'
import ProductFilter from './ProductFilter'
import client from '../../apollo-client/client'
import { fetchProducts } from '../../queries/'

// Hard coded products list.
const productGroupsList = [
  {
    category: 't-shirts',
    products: [
      {
        id: 10,
        name: 'Product 1',
        actualPrice: 342.99,
        discount: 5,
        discountedPrice: 325.84,
        tax: 5,
        imagePath: 'https://source.unsplash.com/random/500x598',
      },
      {
        id: 13,
        name: 'Product 1',
        actualPrice: 821.99,
        discount: 10,
        discountedPrice: 739.79,
        tax: 10,
        imagePath: 'https://source.unsplash.com/random/500x599',
      },
      {
        id: 14,
        name: 'Product 1',
        actualPrice: 342.99,
        discount: 12.5,
        discountedPrice: 300.12,
        tax: 12.5,
        imagePath: 'https://source.unsplash.com/random/500x600',
      },
    ],
  },
  {
    category: 'action figures',
    products: [
      {
        id: 12,
        name: 'Product 1',
        actualPrice: 432.99,
        discount: 18,
        discountedPrice: 355.05,
        tax: 18,
        imagePath: 'https://source.unsplash.com/random/500x601',
      },
    ],
  },
]

class ProductsScreen extends Component {
  state = {
    productGroupsList: [],
  }

  componentDidMount() {
    client
      .query({
        query: fetchProducts,
      })
      .then(response => {
        console.log(response.data)
        this.setState({ productGroupsList: response.data.products })
      })
  }

  render() {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-3">
            {/* {this.state.productGroupsList[0] ? (
              <img src={this.state.productGroupsList[0].imagePath[0]} alt="" />
            ) : (
              ''
            )} */}

            <ProductFilter />
          </div>
          <div className="col-md-9">
            {productGroupsList.map(productGroup => (
              <ProductCardGroup
                key={productGroup.category}
                productGroup={productGroup}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default ProductsScreen
