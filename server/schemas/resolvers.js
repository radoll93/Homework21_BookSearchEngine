const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('books');
    },
    user: async (parent, args ) => {
      const { _id, username } = args;
      return User.findOne({ _id }).populate('books')
    },
    me: async (parent, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },

  Mutation: {
    saveBook: async (parent, args ) => {
      console.log(args)
      return await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body }}
       )
    },
    removeBook: async (parent, { bookId }) => {
      return await User.findOneAndDelete({ _id: bookId });
    },
    addUser: async (parent, { username, email, password }) => {
        return await User.create({ username, email, password });
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
  }
};

module.exports = resolvers;
