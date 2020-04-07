import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth";

const app = express();
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.use("/api/auth", auth);

// async function startServer() {
//   await
// }
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
