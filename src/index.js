import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth";
import users from "./routes/users";
import books from "./routes/books";
// import stream from "./routes/stream";
import Bromise from "bluebird";
import 'babel-polyfill'

const app = express();
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/books", books);
// app.use("/api/stream", stream);

// old ip address 157.51.92.157/32
mongoose.Promise = Bromise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("sucess"))
  .catch((err) => console.log(err));

// startServer();

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
