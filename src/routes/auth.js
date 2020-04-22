import express from "express";
import User from "../models/User";

const router = express.Router();
const app = express();

router.post("/", async (req, res) => {
  const { email, password } = req.body.credentials;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.isValidPassword(password))) {
      return res.status(200).json({ user: user.toAuthJSON() });
    } else {
      return res.status(400).json({
        errors: {
          global: "invalid login",
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.post("/confirmation", async (req, res) => {
//   const token = req.query.token;
//   try {
//     const user = await User.findOneAndUpdate(
//       { confirmationToken: token },
//       { confirmationToken: "", confirmed: true },
//       { new: true }
//     );
//     if (user) {
//       return res.status(200).json({ user: user.toAuthJSON() });
//     } else {
//       return res.status(400).json({
//         errors: {
//           global: "Can't confirm",
//         },
//       });
//     }
//   } catch (err) {
//     res.json({ err });
//   }
// });

export default router;
