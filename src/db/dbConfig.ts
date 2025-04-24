import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// Keep a module-level variable to track the connection
let isConnected = false;

//conncet only one time to the database
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export const connect = async () => {
  if (isConnected) {
    // Avoid creating a new connection if already connecteda
    return mongoose.connection;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {});

    isConnected = true;

    return db.connection;
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    throw error;
  }
};
