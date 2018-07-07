import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'

import UserType from '../types/UserType'
import UserProviderInputType from '../types/UserProviderInputType'
import {
  addUserResolver,
  removeUserResolver,
  updateUserResolver,
  changeUserRoleResolver,
} from '../resolvers/userResolvers'

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
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
    order: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
  },
  resolve: addUserResolver,
}

//  This mutation is not required
const removeUser = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: removeUserResolver,
}

const updateUser = {
  type: UserType,
  args: {
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phone: {
      type: GraphQLString,
    },
  },
  resolve: updateUserResolver,
}

const changeUserRole = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    roles: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
  },
  resolve: changeUserRoleResolver,
}

export { addUser, removeUser, updateUser, changeUserRole }
