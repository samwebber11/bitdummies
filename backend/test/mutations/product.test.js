/* eslint-env jest */

import { ValidationError, Types } from 'mongoose'

import Product from '../../database/models/product'
import User from '../../database/models/user'
import {
  addProductResolver,
  removeProductResolver,
  updateProductInfoResolver,
  updateProductImagesResolver,
  updateProductQuantityResolver,
} from '../../graphql/resolvers/mutations/productResolvers'
import { merge, pick } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'
import {
  AuthenticationError,
  InvalidSizeError,
  ProductNotFoundError,
  AuthorizationError,
} from '../../errors'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addProduct resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
  }

  const dummyProduct = {
    name: 'Handcrafted Plastic Computer',
    category: 'Shoes',
    size: [
      {
        label: 'XS',
        quantityAvailable: 5,
      },
      {
        label: 'M',
        quantityAvailable: 10,
      },
    ],
    description: 'Eum sunt dicta enim animi enim.',
    actualPrice: 984.99,
    discount: 5,
    tax: 12.5,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
    delicacy: 'medium',
  }

  it('Should add a product', async () => {
    expect.assertions(2)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    const product = await addProductResolver(null, dummyProduct, { user })
    expect(product).toHaveProperty('_id')
    // Hack so as to do a deep comparison of the two objects.
    expect(JSON.parse(JSON.stringify(product))).toMatchObject(dummyProduct)

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not add a product when there is no user', async () => {
    expect.assertions(1)
    await expect(addProductResolver(null, dummyProduct, {})).rejects.toThrow(
      new AuthenticationError()
    )
  })

  it('Should not add a product when the user is not authorized to add a product', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)

    // Actual test begins.
    await expect(
      addProductResolver(null, dummyProduct, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'required' fields are missing`, async () => {
    expect.assertions(1)
    // Setup. Missing name.
    const incompleteProduct = pick(dummyProduct, [
      'category',
      'size',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'imagePath',
      'delicacy',
    ])
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, incompleteProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'category' is invalid`, async () => {
    expect.assertions(1)
    // Setup. Invalid category.
    const invalidCategoryProduct = merge(dummyProduct, {
      category: 'Designer THX',
    })
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidCategoryProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product with an empty 'size' array`, async () => {
    expect.assertions(1)
    // Setup. Empty size array.
    const invalidSizeProduct = merge(dummyProduct, { size: [] })
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidSizeProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'size' field is missing`, async () => {
    expect.assertions(1)
    // Setup. Size field missing.
    const invalidSizeProduct = pick(dummyProduct, [
      'name',
      'category',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'imagePath',
      'delicacy',
    ])
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidSizeProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'size' field has objects with duplicate labels`, async () => {
    expect.assertions(1)
    // Setup. Invalid size.
    const invalidSizeProduct = merge(dummyProduct, {
      size: [
        { label: 'XL', quantityAvailable: 5 },
        { label: 'S', quantityAvailable: 10 },
        { label: 'XL', quantityAvailable: 8 },
      ],
    })
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidSizeProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'size' field has objects with invalid quantity`, async () => {
    expect.assertions(1)
    // Setup. Invalid size.
    const invalidSizeProduct = merge(dummyProduct, {
      size: [
        { label: 'XL', quantityAvailable: 5 },
        { label: 'S', quantityAvailable: -15 },
      ],
    })
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidSizeProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should add a product when 'description' field is missing`, async () => {
    expect.assertions(4)
    // Setup.
    const validProduct = pick(dummyProduct, [
      'name',
      'category',
      'size',
      'actualPrice',
      'discount',
      'tax',
      'imagePath',
      'delicacy',
    ])
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    const product = await addProductResolver(null, validProduct, { user })
    expect(product).toHaveProperty('_id')
    expect(product).toHaveProperty('description')
    expect(product.description).toEqual(
      'A very little short description of the searched product is available.'
    )
    expect(JSON.parse(JSON.stringify(product))).toMatchObject(
      merge(validProduct, {
        description:
          'A very little short description of the searched product is available.',
      })
    )

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should add a product when 'discount', 'tax' and 'delicacy' fields are missing`, async () => {
    expect.assertions(7)
    // Setup.
    const validProduct = pick(dummyProduct, [
      'name',
      'category',
      'size',
      'actualPrice',
      'imagePath',
    ])
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    const product = await addProductResolver(null, validProduct, { user })
    expect(product).toHaveProperty('_id')
    expect(product).toHaveProperty('discount')
    expect(product).toHaveProperty('tax')
    expect(product).toHaveProperty('delicacy')
    expect(product.discount).toBe(0)
    expect(product.tax).toBe(5)
    expect(product.delicacy).toBe('high')

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product with an empty 'imagePath' array`, async () => {
    expect.assertions(1)
    // Setup.
    const invalidSizeProduct = merge(dummyProduct, { size: [] })
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidSizeProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'imagePath' field is missing`, async () => {
    expect.assertions(1)
    // Setup.
    const invalidImageProduct = pick(dummyProduct, [
      'name',
      'category',
      'size',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'delicacy',
    ])
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, invalidImageProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not add a product when 'imagePath' field has more than 5 images`, async () => {
    expect.assertions(1)
    // Setup.
    const tooManyImagesProduct = merge(dummyProduct, {
      imagePath: [
        ...dummyProduct.imagePath,
        'Qui quis necessitatibus et eius',
        'Possimus laudantium tenetur eligendi rerum et deserunt illo et eveniet',
        'Fuga qui adipisci et qui',
      ],
    })
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addProductResolver(null, tooManyImagesProduct, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })
})

describe('updateProductInfo resolver', async () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
  }

  const dummyProduct = {
    name: 'Handcrafted Plastic Computer',
    category: 'Shoes',
    size: [
      {
        label: 'XS',
        quantityAvailable: 5,
      },
      {
        label: 'M',
        quantityAvailable: 10,
      },
    ],
    description: 'Eum sunt dicta enim animi enim.',
    actualPrice: 984.99,
    discount: 5,
    tax: 12.5,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
    delicacy: 'medium',
  }

  const updatePayload = {
    name: 'Awesome Plastic Pizza',
    category: 'Gloves',
    size: [
      {
        label: 'S',
        quantityAvailable: 5,
      },
      {
        label: 'L',
        quantityAvailable: 10,
      },
      {
        label: 'XL',
        quantityAvailable: 3,
      },
    ],
    description: 'Omnis reiciendis expedita iure consequatur non.',
    actualPrice: 735.61,
    discount: 10,
    tax: 18,
    imagePath: [
      'Voluptatem nostrum autem.',
      'Ut possimus maiores placeat voluptate quam accusantium aut.',
      'Numquam at sed quo autem velit optio.',
      'Quisquam incidunt fugit vel eos at et alias maiores perspiciatis.',
    ],
    delicacy: 'low',
  }

  it(`Should update a product's 'name', 'category', 'description', 'actualPrice', 'discount', 'tax' and 'delicacy' fields`, async () => {
    expect.assertions(19)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: 'admin' }))
    const productArgs = merge(updatePayload, { id: product._id })

    // Actual test begins.
    const updatedProduct = await updateProductInfoResolver(null, productArgs, {
      user,
    })

    expect(updatedProduct).toHaveProperty('_id')
    expect(updatedProduct).toHaveProperty('name')
    expect(updatedProduct.name).toBe(updatePayload.name)
    expect(updatedProduct).toHaveProperty('category')
    expect(updatedProduct.category).toBe(updatePayload.category)
    expect(updatedProduct).toHaveProperty('description')
    expect(updatedProduct.description).toBe(updatePayload.description)
    expect(updatedProduct).toHaveProperty('actualPrice')
    expect(updatedProduct.actualPrice).toBe(updatePayload.actualPrice)
    expect(updatedProduct).toHaveProperty('discount')
    expect(updatedProduct.discount).toBe(updatePayload.discount)
    expect(updatedProduct).toHaveProperty('tax')
    expect(updatedProduct.tax).toBe(updatePayload.tax)
    expect(updatedProduct).toHaveProperty('delicacy')
    expect(updatedProduct.delicacy).toBe(updatePayload.delicacy)
    expect(updatedProduct).toHaveProperty('size')
    expect(updatedProduct.size.length).toBe(product.size.length)
    expect(updatedProduct).toHaveProperty('imagePath')
    expect(updatedProduct.imagePath.length).toBe(product.imagePath.length)

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update a product when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const productArgs = merge(updatePayload, { id: product._id })

    // Actual test begins.
    await expect(
      updateProductInfoResolver(null, productArgs, {})
    ).rejects.toThrow(new AuthenticationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
  })

  it('Should not update a product when the user is not authorized to update a product', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(dummyUser)
    const productArgs = merge(updatePayload, { id: product._id })

    // Actual test begins.
    await expect(
      updateProductInfoResolver(null, productArgs, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update a product that doesn't exist`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(updatePayload, { id: new Types.ObjectId() })

    // Actual test begins.
    const updatedProduct = await updateProductInfoResolver(null, productArgs, {
      user,
    })
    expect(updatedProduct).toBeNull()

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update a product's 'imagePath' field`, async () => {
    expect.assertions(14)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(pick(updatePayload, ['imagePath']), {
      id: product._id,
    })

    // Actual test begins.
    const updatedProduct = await updateProductInfoResolver(null, productArgs, {
      user,
    })

    expect(updatedProduct).toHaveProperty('_id')
    expect(updatedProduct).toHaveProperty('name')
    expect(updatedProduct.name).not.toEqual(updatePayload.name)
    expect(updatedProduct).toHaveProperty('category')
    expect(updatedProduct.category).not.toEqual(updatePayload.category)
    expect(updatedProduct).toHaveProperty('description')
    expect(updatedProduct).not.toEqual(updatePayload.description)
    expect(updatedProduct).toHaveProperty('discount')
    expect(updatedProduct.discount).not.toEqual(updatePayload.discount)
    expect(updatedProduct).toHaveProperty('imagePath')
    expect(updatedProduct.imagePath.length).not.toBe(0)
    expect(updatedProduct.imagePath.length).not.toBe(
      updatePayload.imagePath.length
    )

    const oldImages = product.imagePath.map(image => image.toString())
    const newImages = updatedProduct.imagePath.map(image => image.toString())
    expect(updatedProduct.imagePath.length).toBe(product.imagePath.length)
    expect(newImages).toEqual(oldImages)

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update a product's 'size' field`, async () => {
    expect.assertions(14)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(pick(updatePayload, ['size']), {
      id: product._id,
    })

    // Actual test begins.
    const updatedProduct = await updateProductInfoResolver(null, productArgs, {
      user,
    })

    expect(updatedProduct).toHaveProperty('_id')
    expect(updatedProduct).toHaveProperty('name')
    expect(updatedProduct.name).not.toEqual(updatePayload.name)
    expect(updatedProduct).toHaveProperty('category')
    expect(updatedProduct.category).not.toEqual(updatePayload.category)
    expect(updatedProduct).toHaveProperty('description')
    expect(updatedProduct).not.toEqual(updatePayload.description)
    expect(updatedProduct).toHaveProperty('discount')
    expect(updatedProduct.discount).not.toEqual(updatePayload.discount)
    expect(updatedProduct).toHaveProperty('size')
    expect(updatedProduct.size.length).not.toBe(0)
    expect(updatedProduct.size.length).not.toBe(updatePayload.size.length)

    const oldSizes = product.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))
    const newSizes = updatedProduct.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))

    expect(updatedProduct.size.length).toBe(product.size.length)
    expect(newSizes).toEqual(oldSizes)

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })
})

describe('updateProductImages resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
  }

  const dummyProduct = {
    name: 'Handcrafted Plastic Computer',
    category: 'Shoes',
    size: [
      {
        label: 'XS',
        quantityAvailable: 5,
      },
      {
        label: 'M',
        quantityAvailable: 10,
      },
    ],
    description: 'Eum sunt dicta enim animi enim.',
    actualPrice: 984.99,
    discount: 5,
    tax: 12.5,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
    delicacy: 'medium',
  }

  const updatePayload = {
    name: 'Awesome Plastic Pizza',
    category: 'Gloves',
    size: [
      {
        label: 'S',
        quantityAvailable: 5,
      },
      {
        label: 'L',
        quantityAvailable: 10,
      },
      {
        label: 'XL',
        quantityAvailable: 3,
      },
    ],
    description: 'Omnis reiciendis expedita iure consequatur non.',
    actualPrice: 735.61,
    discount: 10,
    tax: 18,
    imagePath: [
      'Voluptatem nostrum autem.',
      'Ut possimus maiores placeat voluptate quam accusantium aut.',
      'Numquam at sed quo autem velit optio.',
      'Quisquam incidunt fugit vel eos at et alias maiores perspiciatis.',
    ],
    delicacy: 'low',
  }

  it(`Should update a product's 'imagePath' field`, async () => {
    expect.assertions(6)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(updatePayload, {
      id: product._id,
    })

    // Acual test begins.
    const updatedProduct = await updateProductImagesResolver(
      null,
      productArgs,
      { user }
    )

    expect(updatedProduct).toHaveProperty('_id')
    expect(updatedProduct).toHaveProperty('imagePath')
    const oldImages = product.imagePath.map(image => image.toString())
    const newImages = updatedProduct.imagePath.map(image => image.toString())
    expect(updatedProduct.imagePath.length).not.toBe(product.imagePath.length)
    expect(newImages).not.toEqual(oldImages)
    expect(newImages).toContain(productArgs.imagePath[0])
    expect(newImages).not.toContain(oldImages[0])

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update a product when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const productArgs = merge(pick(updatePayload, ['imagePath']), {
      id: product._id,
    })

    // Actual test begins.
    await expect(
      updateProductImagesResolver(null, productArgs, {})
    ).rejects.toThrow(new AuthenticationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
  })

  it(`Should not update a product's 'imagePath' field when the user is not authorized to update product's images`, async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(dummyUser)
    const productArgs = merge(pick(updatePayload, ['imagePath']), {
      id: product._id,
    })

    // Actual test begins.
    await expect(
      updateProductImagesResolver(null, productArgs, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update a product's 'imagePath' field when product doesn't exist`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(updatePayload, { id: new Types.ObjectId() })

    // Actual test begins.
    const updatedProduct = await updateProductImagesResolver(
      null,
      productArgs,
      { user }
    )
    expect(updatedProduct).toBeNull()

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update a product's any other field`, async () => {
    expect.assertions(12)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(
      pick(updatePayload, ['name', 'category', 'size']),
      { id: product._id }
    )

    // Actual test begins.
    const updatedProduct = await updateProductImagesResolver(
      null,
      productArgs,
      { user }
    )

    expect(updatedProduct).toHaveProperty('_id')
    expect(updatedProduct).toHaveProperty('name')
    expect(updatedProduct.name).toEqual(product.name)
    expect(updatedProduct.name).not.toEqual(updatePayload.name)
    expect(updatedProduct).toHaveProperty('category')
    expect(updatedProduct.category).toEqual(product.category)
    expect(updatedProduct.category).not.toEqual(updatePayload.category)
    expect(updatedProduct).toHaveProperty('size')
    expect(updatedProduct.size.length).not.toBe(0)
    expect(updatedProduct.size.length).not.toBe(updatePayload.size.length)

    const oldSizes = product.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))
    const newSizes = updatedProduct.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))

    expect(updatedProduct.size.length).toBe(product.size.length)
    expect(newSizes).toEqual(oldSizes)

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })
})

describe('updateProductQuantity resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
  }

  const dummyProduct = {
    name: 'Handcrafted Plastic Computer',
    category: 'Shoes',
    size: [
      {
        label: 'XS',
        quantityAvailable: 5,
      },
      {
        label: 'M',
        quantityAvailable: 10,
      },
    ],
    description: 'Eum sunt dicta enim animi enim.',
    actualPrice: 984.99,
    discount: 5,
    tax: 12.5,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
    delicacy: 'medium',
  }

  const updatePayload = {
    name: 'Awesome Plastic Pizza',
    category: 'Gloves',
    size: [
      {
        label: 'S',
        quantityAvailable: 5,
      },
      {
        label: 'L',
        quantityAvailable: 10,
      },
      {
        label: 'XL',
        quantityAvailable: 3,
      },
    ],
    description: 'Omnis reiciendis expedita iure consequatur non.',
    actualPrice: 735.61,
    discount: 10,
    tax: 18,
    imagePath: [
      'Voluptatem nostrum autem.',
      'Ut possimus maiores placeat voluptate quam accusantium aut.',
      'Numquam at sed quo autem velit optio.',
      'Quisquam incidunt fugit vel eos at et alias maiores perspiciatis.',
    ],
    delicacy: 'low',
  }

  it(`Should update a product's 'size' field`, async () => {
    expect.assertions(6)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(updatePayload, {
      id: product._id,
    })

    // Actual test begins.
    const updatedProduct = await updateProductQuantityResolver(
      null,
      productArgs,
      { user }
    )

    expect(updatedProduct).toHaveProperty('_id')
    expect(updatedProduct).toHaveProperty('size')
    expect(updatedProduct.size.length).not.toBe(0)

    const oldSizes = product.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))

    const expectedSizes = [...oldSizes]
    productArgs.size.forEach(newSize => {
      let sizeInCommon = false
      expectedSizes.forEach(oldSize => {
        if (oldSize.label === newSize.label) {
          sizeInCommon = true
          oldSize.quantityAvailable = newSize.quantityAvailable
        }
      })

      if (!sizeInCommon) {
        expectedSizes.push(newSize)
      }
    })

    const newSizes = updatedProduct.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))

    expect(newSizes.length).toBe(expectedSizes.length)
    expect(newSizes).toEqual(expectedSizes)
    expect(newSizes).not.toEqual(oldSizes)

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update a product when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const productArgs = merge(pick(updatePayload, ['size']), {
      id: product._id,
    })

    // Actual test begins.
    await expect(
      updateProductQuantityResolver(null, productArgs, {})
    ).rejects.toThrow(new AuthenticationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
  })

  it(`Should not updade a product's 'size' field when the user is not authorized to update the quantity`, async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(dummyUser)
    const productArgs = merge(pick(updatePayload, ['size']), {
      id: product._id,
    })

    // Actual test begins.
    await expect(
      updateProductQuantityResolver(null, productArgs, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update a product that doesn't exist`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(updatePayload, { id: new Types.ObjectId() })

    // Actual test begins.
    await expect(
      updateProductQuantityResolver(null, productArgs, { user })
    ).rejects.toThrow(new ProductNotFoundError())

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update when 'size' field is missing`, async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const productArgs = merge(
      pick(updatePayload, ['name', 'category', 'imagePath']),
      { id: product._id }
    )

    // Actual test begins.
    await expect(
      updateProductQuantityResolver(null, productArgs, { user })
    ).rejects.toThrow(new InvalidSizeError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })
})

describe('removeProduct resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
  }

  const dummyProduct = {
    name: 'Handcrafted Plastic Computer',
    category: 'Shoes',
    size: [
      {
        label: 'XS',
        quantityAvailable: 5,
      },
      {
        label: 'M',
        quantityAvailable: 10,
      },
    ],
    description: 'Eum sunt dicta enim animi enim.',
    actualPrice: 984.99,
    discount: 5,
    tax: 12.5,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
    delicacy: 'medium',
  }

  it('Should remove a product', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    const removedProduct = await removeProductResolver(
      null,
      { id: product._id },
      { user }
    )
    // Hack to avoid hitting the call stack.
    expect(JSON.stringify(removedProduct)).toEqual(JSON.stringify(product))

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not remove a product when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)

    // Actual test begins.
    await expect(
      removeProductResolver(null, { id: product._id }, {})
    ).rejects.toThrow(new AuthenticationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
  })

  it('Should not remove a product when the user is not authorized to remove a product', async () => {
    expect.assertions(1)
    // Setup.
    const product = await Product.create(dummyProduct)
    const user = await User.create(dummyUser)

    // Actual test begins.
    await expect(
      removeProductResolver(null, { id: product._id }, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await Product.findByIdAndRemove(product._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not remove a product that doesn't exist`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    const removedProduct = await removeProductResolver(
      null,
      { id: new Types.ObjectId() },
      { user }
    )
    expect(removedProduct).toBeNull()

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })
})
