import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import UserType from '../types/UserType'
import UserProviderInputType from '../types/UserProviderInputType'
import User from '../../database/models/user'
import { Types } from 'mongoose'

// There is no need to add this and test it bcz it will be tested through our google
// strategy right now and when we will use local strategy we can use this mutation to add a new user.
// This mutation is not required.
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
  resolve: async (parent, args, context) => {
    try {
      let user = new User(args)
      user = await user.save()
      return user
    } catch (err) {
      console.log('Error occured in adding new user: ', err)
    }
  },
}

//  This mutation is not required
const removeUser = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args, context) => {
    if (context.user) {
      try {
        const userId = context.user._id
        let user = User.findById(userId)
        if (!user) {
          throw new Error('Error finding user with this id: ')
        }
        if (
          user.order.status === 'Dispatched' ||
          user.order.status === 'On Its Way'
        ) {
          throw new Error('User registered with some order')
        }
        // args._id = new Types.ObjectId()
        user = await User.findByIdAndRemove(args.id)
        return user
      } catch (err) {
        console.log('Error occured in removing user: ', err)
      }
    }
  },
}

const updateUser = {
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
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (parent, args, context) => {
    if (context.user) {
      const userId = context.user._id
      let user = await User.findById(userId)
      if (!user) {
        throw new Error('No user found')
      }
      try {
        args._id = new Types.ObjectId()
        user = await User.findByIdAndUpdate(
          args._id,
          {
            $set: {
              provider: args.provider,
              email: args.email,
              firstName: args.firstName,
              lastName: args.lastName,
              phone: args.phone,
            },
          },
          { new: true }
        )
      } catch (err) {
        console.log('User cannot be updated: ', err)
        throw err
      }
    }
  },
}

export { addUser, removeUser, updateUser }
