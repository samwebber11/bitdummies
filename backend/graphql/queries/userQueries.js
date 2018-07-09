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
import { GET_USER_BY_ID, GET_ALL_USERS } from '../../database/operations'
import AuthenticationError from '../../errors/AuthenticationError'
import AuthorizationError from '../../errors/AuthorizationError'

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
          provider: {
            type: new GraphQLInputObjectType({
              name: 'FilterUsersByProvider',
              fields: {
                name: {
                  type: GraphQLString,
                },
              },
            }),
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
  resolve: async (parent, args, context) => {
    const { user } = context
    if (!user) {
      throw new AuthenticationError()
    }
    try {
      if (!user.isAuthorizedTo(GET_ALL_USERS)) {
        throw new AuthorizationError()
      }
      const userList = await User.find(args.filters).sort(args.orderBy)
      return userList
    } catch (err) {
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
  resolve: async (parent, args, context) => {
    // eslint-disable-next-line no-shadow
    const { user } = context
    if (!user) {
      throw new AuthenticationError()
    }
    try {
      if (!user.isAuthorizedTo(GET_USER_BY_ID)) {
        throw new AuthorizationError()
      }
      const userStored = await User.findById(args.id)
      return userStored
    } catch (err) {
      throw err
    }
  },
}

export { users, user }
