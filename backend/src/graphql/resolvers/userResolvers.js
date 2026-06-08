const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../../models/User");

const generateToken = require("../../utils/generateToken");

const { validateEmail, validatePassword } = require("../../utils/validators");

const formatDate = require("../../utils/formatDate");

const userResolvers = {
  User: {
    createdAt: (user) => formatDate(user.createdAt),
    updatedAt: (user) => formatDate(user.updatedAt),
  },

  Query: {
    users: async (_, { role }, context) => {
      if (!context.user || context.user.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      const filter = role ? { role } : {};
      return await User.find(filter);
    },

    me: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return context.user;
    },
  },

  Mutation: {
    register: async (_, args, context) => {
      try {
        // Account provisioning is admin-only — there is no public sign-up.
        if (!context.user || context.user.role !== "ADMIN") {
          throw new Error("Not authorized");
        }

        const { name, email, password, role, phone, address } = args;

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
          phone: phone || null,
          address: address || null,
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

    createTechnician: async (_, args, context) => {
      try {
        // Only admins can provision technician accounts.
        if (!context.user || context.user.role !== "ADMIN") {
          throw new Error("Not authorized");
        }

        const { name, email, phone } = args;

        if (!validateEmail(email)) {
          throw new Error("Invalid email");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new Error("User already exists");
        }

        // generate a secure, random temporary password the admin can share
        const temporaryPassword = crypto.randomBytes(9).toString("base64url");

        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const user = await User.create({
          name,
          email,
          phone: phone || null,
          password: hashedPassword,
          role: "TECHNICIAN",
          mustChangePassword: true,
        });

        return {
          user,
          temporaryPassword,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    changePassword: async (_, args, context) => {
      try {
        if (!context.user) {
          throw new Error("Not authenticated");
        }

        const { currentPassword, newPassword } = args;

        const user = await User.findById(context.user._id);

        if (!user) {
          throw new Error("Not authenticated");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
          throw new Error("Current password is incorrect");
        }

        if (!validatePassword(newPassword)) {
          throw new Error("Password must be at least 6 characters");
        }

        if (currentPassword === newPassword) {
          throw new Error("New password must be different from the current password");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false;
        await user.save();

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
