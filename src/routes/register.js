import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
	const { credentials } = req.body;
	let user;
	try {
		user = await User.findOne({ email: credentials.email });
	} catch (err) {
		console.log(err);
		return
	}
	if (user) {
		return res.status(400).json({
			errors: {
				global: "email already exist",
			},
		});
	}
	let password;
	try {
		password = await bcrypt.hash(credentials.password, 10);
	} catch (err) {
		console.log(err);
		return
	}

	const myUser = { email: credentials.email, password };
	const myData = new User(myUser);
	let item;
	try {
		item = await myData.save();
		return res.status(200).json({ user: item });
	} catch (err) {
		console.log(err);
		return res.status(400).send("unable to save to database");
	}

});

export default router;
