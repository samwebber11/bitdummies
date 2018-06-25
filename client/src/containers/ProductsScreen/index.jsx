import React from 'react'

import ProductCardGroup from './ProductCardGroup'

// Hard coded products list.
const productGroupsList = [
  {
    category: 't-shirts',
    products: [
      {
        id: 1,
        name: 'Product 1',
        actualPrice: 342.99,
        discount: 5,
        discountedPrice: 325.84,
        image: 'https://source.unsplash.com/random/500x598',
      },
      {
        id: 3,
        name: 'Product 1',
        actualPrice: 821.99,
        discount: 10,
        discountedPrice: 739.79,
        image: 'https://source.unsplash.com/random/500x599',
      },
      {
        id: 4,
        name: 'Product 1',
        actualPrice: 342.99,
        discount: 12.5,
        discountedPrice: 300.12,
        image: 'https://source.unsplash.com/random/500x600',
      },
    ],
  },
  {
    category: 'action figures',
    products: [
      {
        id: 2,
        name: 'Product 1',
        actualPrice: 432.99,
        discount: 18,
        discountedPrice: 355.05,
        image: 'https://source.unsplash.com/random/500x601',
      },
    ],
  },
]

const ProductsScreen = () => (
  <div className="container">
    {productGroupsList.map(productGroup => (
      <ProductCardGroup
        key={productGroup.category}
        productGroup={productGroup}
      />
    ))}
  </div>
)

export default ProductsScreen
