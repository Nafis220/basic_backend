import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(error);
      throw err;
    }),
      app.listen(PORT, () => {
        console.log(`app is listening to port ${PORT}`);
      });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
