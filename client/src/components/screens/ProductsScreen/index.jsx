import React from 'react'

import ProductCardGroup from './ProductCardGroup'

// Hard coded products list.
const productsList = [
  {
    category: 't-shirts',
    items: [
      {
        id: 1,
        uri: 'https://source.unsplash.com/random/500x598',
        name: 'Product 1',
        price: 342.99,
        discount: 32.99,
      },
      {
        id: 3,
        uri: 'https://source.unsplash.com/random/500x599',
        name: 'Product 1',
        price: 821.99,
        discount: 38.13,
      },
      {
        id: 4,
        uri: 'https://source.unsplash.com/random/500x600',
        name: 'Product 1',
        price: 342.99,
        discount: 42.39,
        category: 't-shirts',
      },
    ],
  },
  {
    category: 'action figures',
    items: [
      {
        id: 2,
        uri: 'https://source.unsplash.com/random/500x601',
        name: 'Product 1',
        price: 432.99,
        discount: 25.99,
      },
    ],
  },
]

const ProductsScreen = () => (
  <div className="container">
    {productsList.map(products => (
      <ProductCardGroup key={products.category} products={products} />
    ))}
  </div>
)

export default ProductsScreen
