import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.once("connected", () => {
      isConnected = true;
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error. Please make sure MongoDb is running." + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}
