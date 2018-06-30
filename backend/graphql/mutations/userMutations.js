import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import UserType from '../types/UserType'
import UserProviderInputType from '../types/UserProviderInputType'
import User from '../../database/models/user'

const addUser = {
  type: UserType,
  args: {
    provider: {
      type: new GraphQLNonNull(UserProviderInputType),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phone: {
      type: GraphQLString,
    },
    address: {
      type: GraphQLID,
    },
    order: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    try {
      let user = new User(args)
      user = await user.save()
      return user
    } catch (err) {
      console.log('Error occured in adding new user: ', err)
    }
  },
}

const removeUser = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const user = await User.findByIdAndRemove(args.id)
      return user
    } catch (err) {
      console.log('Error occured in removing user: ', err)
    }
  },
}

const updateUser = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    provider: {
      type: new GraphQLNonNull(UserProviderInputType),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    address: {
      type: GraphQLID,
    },
    order: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    try {
      const user = await User.findByIdAndUpdate(
        args.id,
        {
          $set: {
            provider: args.provider,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            address: args.address,
            order: args.order,
          },
        },
        { new: true }
      )
      return user
    } catch (err) {
      console.log('Error occured in updating user: ', args.id)
    }
  },
}

export { addUser, removeUser, updateUser }
