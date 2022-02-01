const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    books: async () => {
      return Book.find().sort({ createdAt: -1 });
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    user: async (parent, { _id }) => {
      return User.findOne({ _id }).populate('books')
    }
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
      return await Book.findOneAndDelete({ _id: bookId });
    },
    addUser: async (parent, { username, email, password }) => {
        return await Book.create({ username, email, password });
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
