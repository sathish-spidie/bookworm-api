import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

function toAuthJSON(email) {
    const token = jwt.sign(
        {
            email,
        },
        process.env.JWTSECRET
    );
    return {
        email,
        token,
    };
}

router.post("/", async (req, res) => {
    const { credentials } = req.body;
    try {
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
           return res.status(400).json({
                errors: {
                    global: "user doesn't exist",
                },
            });
        }
        try {
            let match = await bcrypt.compare(
                credentials.password,
                user.password
            );
            if (!match) {
               res.status(400).json({
                    errors: {
                        global: "password doesn't match",
                    },
                });
               return 
            }
        } catch (err) {
            console.log(err);
            return
        }
        return res.json({ user: toAuthJSON(user.email) });
    } catch (err) {
        console.log(err);
        return
    }
});

export default router;
