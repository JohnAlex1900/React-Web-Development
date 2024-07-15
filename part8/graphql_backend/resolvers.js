const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const {
  AuthenticationError,
  UserInputError,
  ApolloError,
} = require("apollo-server-errors");

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      try {
        if (!args.author && !args.genre) {
          // Ensure proper population of the author field
          return Book.find({}).populate("author");
        }

        if (args.author && args.genre) {
          const author = await Author.findOne({ name: args.author });
          if (!author) {
            throw new UserInputError("Author not found");
          }
          return Book.find({
            author: author._id,
            genres: { $in: [args.genre] },
          }).populate("author");
        }

        if (args.author) {
          const author = await Author.findOne({ name: args.author });
          if (!author) {
            throw new UserInputError("Author not found");
          }
          return Book.find({ author: author._id }).populate("author");
        }

        if (args.genre) {
          return Book.find({ genres: { $in: [args.genre] } }).populate(
            "author"
          );
        }
      } catch (error) {
        console.error("Error in allBooks resolver:", error);
        throw new UserInputError(error.message);
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id });
          return {
            name: author.name,
            born: author.born,
            bookCount,
          };
        })
      );
    },
    me: async (root, args, context) => {
      const users = await User.find({});
      if (users.length === 0) {
        return null;
      }

      if (context.currentUser === null) {
        throw new AuthenticationError("not authenticated, user is null!");
      }
      return users.find((user) => user.username);
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (context.currentUser === null) {
        throw new AuthenticationError("not authenticated, user is null!");
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new ApolloError(error.message, "BAD_USER_INPUT", {
            invalidArgs: args.author,
          });
        }
      }

      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (error) {
        throw new ApolloError(error.message, {
          invalidArgs: args,
        });
      }

      const populatedBook = await book.populate("author");

      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });

      return populatedBook;
    },
    editAuthor: async (root, args, context) => {
      if (context.currentUser === null) {
        throw new AuthenticationError("not authenticated, user is null!");
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new ApolloError(error.message, "BAD_USER_INPUT", {
          invalidArgs: args,
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      try {
        return await user.save();
      } catch (error) {
        throw new ApolloError(error.message, "BAD_USER_INPUT", {
          invalidArgs: args,
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "Johnirungu19") {
        throw new ApolloError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
