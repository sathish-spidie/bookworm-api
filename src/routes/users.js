import express from "express";
import User from "../models/User";
import parseError from "../utils/parseError";

const router = express.Router();

router.post("/", async (req, res) => {
	const { email, password } = req.body.credentials;

	try {
		const user = new User({ email });
		await user.setPassword(password);	
		await user.save();
		return res.status(200).json({ user: user.toAuthJSON() });
	} catch (err) {
		return res.status(400).json({ errors: parseError(err.errors) });
	}
});

export default router;
