import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

async function isValidPassword(password, hash) {
  const result = await bcrypt.compareSync(password, hash).then((data) => data);
  return result;
}

function generateJWT(email) {
  return jwt.sign(
    {
      email,
    },
    process.env.JWTSECRET
  );
}

function toAuthJSON(email) {
  return {
    email,
    token: generateJWT(email),
  };
}

router.post("/", async (req, res) => {
  const { credentials } = req.body;
  const user = await User.findOne({ email: credentials.email });
  if (!user) {
    res.status(400).json({
      errors: {
        global: "invalid credentials",
      },
    });
  } else if (
    !(await isValidPassword(credentials.password, user.passwordHash))
  ) {
    res.status(400).json({
      errors: {
        global: "invalid credentials",
      },
    });
  } else {
    res.json({ user: toAuthJSON(user.email) });
  }
});

export default router;
