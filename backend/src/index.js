import express from "express"; // used for easier api implementation
import dotenv from "dotenv"; // this module allows us to load environment variables from the .env file
import cookieParser from "cookie-parser";

import {connectDB} from "./lib/db.js"; // in curly brackets for explicit import

import authRoutes from "./routes/auth.route.js";

dotenv.config(); // loads env variables from .env to process.env making them available in that variable

const app = express();

app.use(express.json()); // makes json requests accessible in req.body
// clients send data in json format. using the above makes them usable
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();
})