import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth";
import register from "./routes/register";
import Bromise from "bluebird"

const app = express();
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.use("/api/auth", auth);
app.use("/api/user", register);

// old ip address 157.51.92.157/32
mongoose.Promise = Bromise
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("sucess"))
  .catch((err) => console.log(err));

// startServer();

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
