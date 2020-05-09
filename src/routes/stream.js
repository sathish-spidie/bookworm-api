import express from "express";

const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", async (request, response) => {
	const video = path.join(__dirname, "./videos/sample.mp4"); // source video
	let stat = fs.statSync(video);
	let range = request.headers.range; // will be undefined on first request

	if (range) {
		// if the user is requesting to scrub to a point in the video
		let [start, end] = range.replace(/bytes=/, "").split("-"); // the incoming range typically looks like bytes=3214-5435, so extract the numbers out from the request
		start = parseInt(start, 10); // check we are dealing with an integer
		end = end ? parseInt(end, 10) : stat.size - 1; // a request can be for a segment,
		 // or could be 'bytes=324-' idicating from here, until the end of the video.
		  // Therefore end can be undefined.
		// if it is undefined set it to the length of the video content

		  if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }
    
			const result = {
				Start: start,
				End : end
			}

		response.writeHead(206, {
			// 206 tells the browser to expect a partial request, so a continuation of a stream
			"Content-Range": `bytes ${result.Start}-${result.End}/${stat.size}`, // the current 
			// requested segment
			"Accept-Ranges": "bytes",
			"Content-Length": end - start + 1, // not video size, but instead the actual length of buffer
			"Content-Type": "video/mp4",
		});

		fs.createReadStream(video, { start, end }).pipe(response); // only stream part of video from given timestamps - handles request for us
	} else {
		// a new first time request would hit this point, since there is no range to scrub to. Therefore just begin a new stream
		response.writeHead(200, {
			"Content-Length": stat.size, // the total length of the content
			"Content-Type": "video/mp4",
		});

		fs.createReadStream(video).pipe(response);
	}
});

export default router;
