const mongoose = require("mongoose");

/**
 * Connect to MongoDB with retry and exponential backoff.
 * Configurable via env:
 *  - MONGO_CONNECT_RETRIES (default 5)
 *  - MONGO_CONNECT_DELAY (ms, default 1000)
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "MONGO_URI is not set. Create a .env file or set the environment variable MONGO_URI.",
    );
    process.exit(1);
  }

  const maxRetries = parseInt(process.env.MONGO_CONNECT_RETRIES || "5", 10);
  const baseDelay = parseInt(process.env.MONGO_CONNECT_DELAY || "1000", 10);

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      attempt += 1;
      await mongoose.connect(uri);
      console.log("MongoDB Connected");
      return;
    } catch (error) {
      const isLast = attempt > maxRetries;
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${error.message}`,
      );

      if (isLast) {
        console.error(
          `Could not connect to MongoDB after ${attempt} attempts.`,
        );
        process.exit(1);
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying MongoDB connection in ${delay} ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
