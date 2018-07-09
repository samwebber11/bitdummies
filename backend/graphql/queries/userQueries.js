import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import UserType from '../types/UserType'
import OrderByType from '../types/OrderByType'
import { usersResolver, userResolver } from '../resolvers/queries/userResolvers'

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
  resolve: usersResolver,
}

// Fetch a user either by ID.
const user = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: userResolver,
}

export { users, user }
