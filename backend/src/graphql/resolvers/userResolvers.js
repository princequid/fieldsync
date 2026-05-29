const bcrypt = require("bcryptjs");

const User = require("../../models/User");

const generateToken = require("../../utils/generateToken");

const { validateEmail, validatePassword } = require("../../utils/validators");

const userResolvers = {
  Query: {
    users: async (_, args, context) => {
      if (!context.user || context.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      return await User.find();
    },

    me: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return context.user;
    },
  },

  Mutation: {
    register: async (_, args) => {
      try {
        const { name, email, password, role } = args;

        if (!validateEmail(email)) {
          throw new Error("Invalid email");
        }

        if (!validatePassword(password)) {
          throw new Error("Password must be at least 6 characters");
        }

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new Error("User already exists");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
        });

        // generate token
        const token = generateToken(user);

        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (_, args) => {
      try {
        const { email, password } = args;

        // find user
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        // generate token
        const token = generateToken(user);

        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = userResolvers;
