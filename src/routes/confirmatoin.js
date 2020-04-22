import User from "../models/User";

export const confirmation = async (req, res) => {
	const token = req.body.token;
	try {
		const user = await User.findOneAndUpdate(
			{ confirmationToken: token },
			{ confirmationToken: "", confirmed: true },
			{ new: true }
		);
		if (user) {
			return res.status(200).json({ user: user.toAuthJSON() });
		} else {
			return res.status(400).json({
				errors: {
					global: "Can't confirm",
				},
			});
		}
	} catch (err) {
		res.json({ err });
	}
};
