import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql'

import UserType from '../types/UserType'
import User from '../../database/models/user'

const users = {
  type: UserType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    try {
      const userStored = await User.findById(args.id)
      return userStored
    } catch (err) {
      console.log('Error Occured in fetching Users: ', err)
    }
  },
}

const user = {
  type: new GraphQLList(UserType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortUsers',
        fields: {
          firstName: {
            type: GraphQLString,
          },
          lastName: {
            type: GraphQLString,
          },
        },
      }),
      type: new GraphQLObjectType({
        fields: {
          name: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const userList = await User.find({}).sort(args.orderBy)
      return userList
    } catch (err) {
      console.log('Error occured in fetching ordered users: ', err)
    }
  },
}

export { users, user }
