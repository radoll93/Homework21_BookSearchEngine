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
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },

  Mutation: {
    saveBook: async (parent, {token, bookId, authors, description, title }) => {
      
      return await User.findOneAndUpdate(
          { _id: token },
          { $addToSet: { savedBooks: {bookId, authors, description, title} }},
          { new: true, runValidators: true }
       )
    },
    removeBook: async (parent, { _id, bookId }) => {
      return await User.findOneAndDelete(
        { _id: _id },
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
