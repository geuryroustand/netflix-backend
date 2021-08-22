import { getReview, writeReview } from "../../ReadAndWriteData/index.js";

import express from "express";
import uniqid from "uniqid";
const reviewRouter = express();

reviewRouter.put("/:mediaId/:reviews", async (req, res, next) => {
  try {
    const reviews = await getReview();

    // const reviewFound = reviews.find(review => review)

    const newReview = {
      reviews: [
        {
          ...req.body,
          _id: uniqid(),
          mdbI: req.params.mediaId,
          createdAt: new Date(),
        },
      ],
    };
    // reviews.push(newReview);

    // await writeReview(reviews);

    res.send("info sent!");
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
