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
    me: async (parent, args, context) => {
      console.log(`query-me start: ${context.user}`)
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },

  Mutation: {
    saveBook: async (parent, args, context ) => {
      console.log(context.user)
      if (context.user) {
   
      return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args }},
          { new: true, runValidators: true }
       )
      }
    },
    removeBook: async (parent, { bookId }, context ) => {
      return await User.findOneAndDelete(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
        );
    },
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);

        return {token, user}
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
