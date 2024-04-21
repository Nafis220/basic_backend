import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
import fs from "fs";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
import serviceAccount from "../path/to/serviceAccountKey.json" assert { type: "json" };
import ApiError from "./ApiErrors.utils.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGEBUCKET, // Replace with your Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

const fileUpload = async (filePath, fileName) => {
  try {
    const firebaseFileName = `uploads/${fileName}`;
    await bucket.upload(filePath, { destination: firebaseFileName });
    //! here we save used Public Access URLs which have unlimited access

    const [url] = await bucket.file(firebaseFileName).getSignedUrl({
      action: "read",
      expires: "01-01-3000", // Optional expiration date
    });
    if (url != null && fileName != null) {
      fs.unlinkSync(filePath);
    }
    return url;
  } catch (error) {
    console.log(error, "from here");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new ApiError(error.statusCode, error.message);
  }
};

export default fileUpload;
