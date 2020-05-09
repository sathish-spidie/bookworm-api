import express from "express";
import authenticate from "../middlewares/authenticate";
import { parseString } from "xml2js";
import request from "request-promise";
import Book from "../models/Book";
import parseError from "../utils/parseError";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
	Book.find({ userId: req.currentUser._id })
		.then((books) => {
			if (books) {
				return res.status(200).json({ books });
			}
		})
		.catch((err) => res.status(400).json({ errors: parseError(err.errors) }));
});

router.post("/", (req, res) => {
	let flag;
	const check = Book.find({ userId: req.currentUser._id })
		.then((bookie) =>
			bookie.filter((x) => x.goodreadsId === req.body.books.goodreadsId)
		)
		.then((arr) =>
			arr.forEach((x) => {
				if (x) {
					flag = true;
				}
			})
		)
		.then(() => {
			if (flag) {
				res.status(400).json({ err: "user already has this book" });
				return;
			} else {
				const myBook = Object.assign({}, req.body.books, {
					userId: req.currentUser._id,
				});
				Book.create(myBook)
					.then((books) => res.json({ books }))
					.catch((err) =>
						res.status(400).json({ errors: parseError(err.errors) })
					);
			}
		});
});

// return {books:[{}]}
router.get("/search", (req, res) => {
	request
		.get(
			`https://www.goodreads.com/search/index.xml?key=jm0OtnI6UkyeN1dJEJA&q=${req.query.q}`
		)
		.then((result) => {
			parseString(result, (err, goodreadsResult) => {
				if (!err) {
					if (
						typeof goodreadsResult.GoodreadsResponse.search[0].results[0]
							.work === "object"
					) {
						res.json({
							books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(
								(work) => ({
									goodreadsId: work.best_book[0].id[0]._,
									title: work.best_book[0].title[0],
									authors: work.best_book[0].author[0].name[0],
									covers: [work.best_book[0].image_url[0]],
								})
							),
						});
					} else {
						res.json({ err: goodreadsResult });
					}
					return;
				} else {
					res.status(401).json({ errors: { global: "Nah.." } });
					return;
				}
			});
		});
});

router.get("/fetchPages", (req, res) => {
	if (req.query.id) {
		request
			.get(
				`https://www.goodreads.com/book/show?key=${process.env.GOODREADSKEY}&id=${req.query.id}`
			)
			.then((result) =>
				parseString(result, (err, goodreadsResult) => {
					if (!err) {
						res.json({
							pages: goodreadsResult.GoodreadsResponse.book[0].num_pages[0],
						});
					} else {
						res.status(401).json({ errors: { global: "Nah.." } });
					}
				})
			);
	} else {
		res.status(401).json({ errors: { global: "SomethingWentWrong.." } });
	}
});

export default router;
