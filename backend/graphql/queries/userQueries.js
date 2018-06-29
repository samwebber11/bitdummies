import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import UserType from '../types/UserType'
import OrderByType from '../types/OrderByType'
import User from '../../database/models/user'

// Fetch the list of all users (can be filtered).
const users = {
  type: new GraphQLList(UserType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortUsersBy',
        fields: {
          firstName: {
            type: OrderByType,
          },
          lastName: {
            type: OrderByType,
          },
          name: {
            type: OrderByType,
          },
        },
      }),
    },
    filters: {
      type: new GraphQLInputObjectType({
        name: 'FilterUsersBy',
        fields: {
          'provider.name': {
            type: GraphQLString,
          },
          email: {
            type: GraphQLString,
          },
          firstName: {
            type: GraphQLString,
          },
          lastName: {
            type: GraphQLString,
          },
          phone: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const userList = await User.find(args.filters).sort(args.orderBy)
      return userList
    } catch (err) {
      console.log('Error occurred in fetching users: ', err)
      throw err
    }
  },
}

// Fetch a user either by ID.
const user = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const userStored = await User.findById(args.id)
      return userStored
    } catch (err) {
      console.log('Error Occured in fetching user by ID: ', err)
      throw err
    }
  },
}

export { users, user }
