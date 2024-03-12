import express from "express";
import mongoose from "mongoose";
import clubRouter from "./routes/clubRoutes";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
import resourceRouter from "./routes/resourceRoutes";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import multer from "multer";
const envConfig = dotenv.config({ silent: true });

if (envConfig.error) {
  throw envConfig.error;
}

const app = express();
const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.MONGODB_URI;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//For CORS
app.use(cors({ origin: "*" }));

// For build folder
app.use(express.static(path.join(__dirname, "client", "build")));

//using boody-parser to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//setting primary routes
app.use("/clubs", clubRouter);
app.use("/club", clubRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/event", eventRouter);
app.use("/events", eventRouter);
app.use("/resource", resourceRouter);

// Catchall route handler
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Establishing connection with db
mongoose
  .connect(CONNECTION_URL, connectionParams)
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Application is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err.message);
  });

mongoose.set("useFindAndModify", false);
