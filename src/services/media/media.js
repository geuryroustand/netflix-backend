import express, { query } from "express";
import uniqid from "uniqid";
import { getMedia, writeMedia } from "../../ReadAndWriteData/index.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

const saveImg = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "netflix",
  },
});

const mediaRouter = express();

mediaRouter.get("/", async (req, res, next) => {
  try {
    const medias = await getMedia();

    // res.send(medias);
    if (req.query && req.query.title) {
      const filterByTitle = medias.filter((t) => t.title === req.query.title);
      res.send(filterByTitle);
      // console.log(filterByTitle);
      console.log(filterByTitle);
    } else {
      res.send(medias);
    }
  } catch (error) {
    next(error);
  }
});

mediaRouter.get("/:mediaID", async (req, res, next) => {
  try {
    const medias = await getMedia();

    const mediaFound = medias.find(
      (media) => media.imdbID === req.params.mediaID
    );
    if (mediaFound) {
      res.send(mediaFound);
    } else {
      next(createHttpError(404, `Id ${req.params.mediaID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// mediaRouter.get("/:?", async (req, res, next) => {
//   try {
//     if (req.query && req.query.title) {
//       console.log("here", req.query.name);
//     }
//     res.send(`${req.query}`);
//   } catch (error) {
//     next(error);
//   }
// });

// mediaRouter.get("/:mediaID/:review", async (req, res, next) => {
//   try {
//     const medias = await getMedia();

//     const mediaFound = medias.find(
//       (media) => media.imdbID === req.params.mediaID
//     );

//     res.send(mediaFound);
//   } catch (error) {
//     next(error);
//   }
// });

mediaRouter.post("/", async (req, res, next) => {
  try {
    const medias = await getMedia();

    const newMedia = {
      ...req.body,
      imdbID: uniqid(),
    };

    medias.push(newMedia);

    await writeMedia(medias);

    res.send(medias);
  } catch (error) {
    next(error);
  }
});

mediaRouter.put("/:mediaId", async (req, res, next) => {
  try {
    const medias = await getMedia();

    const restMedias = medias.filter(
      (media) => media.imdbID !== req.params.mediaId
    );
    const mediaFoundISameID = medias.find(
      (media) => media.imdbID === req.params.mediaId
    );
    const upgradetedMedia = {
      ...req.body,
      imdbID: req.params.mediaId,
      upgreadedAt: new Date(),
    };

    if (!mediaFoundISameID) {
      next(createHttpError(404, `Not found with the ID ${req.params.mediaId}`));
    } else {
      restMedias.push(upgradetedMedia);

      await writeMedia(restMedias);
    }

    res.send("done");
  } catch (error) {
    next(error);
  }
});

mediaRouter.put(
  "/:mediaId/poster",
  multer({ storage: saveImg }).single("poster"),
  async (req, res, next) => {
    try {
      const medias = await getMedia();

      const restMedia = medias.filter(
        (media) => media.imdbID !== req.params.mediaId
      );

      const foundMedia = medias.find(
        (media) => media.imdbID === req.params.mediaId
      );
      const newMedia = { ...foundMedia, poster: req.file.path };

      if (!foundMedia) {
        next(createHttpError(404, ` Id ${req.params.mediaId} not found`));
      }

      restMedia.push(newMedia);

      await writeMedia(restMedia);

      res.send();
    } catch (error) {
      next(error);
    }
  }
);

// "comment":"{{$randomLoremSentence}}",
// "rate":"{{$randomPhoneNumberExt}}"

mediaRouter.put("/:mediaId/:reviews", async (req, res, next) => {
  try {
    const reviews = await getMedia();

    const restMedia = reviews.filter(
      (review) => review.imdbID !== req.params.mediaId
    );

    const mediaFound = reviews.find(
      (mediaFound) => mediaFound.imdbID === req.params.mediaId
    );
    if (!mediaFound) {
      next(createHttpError(404, `ID ${req.params.mediaId} not found`));
    }

    const newMediaFoundWithReview = {
      ...mediaFound,
      reviews: [
        {
          _id: uniqid(),
          comment: req.body.comment,
          rate: req.body.rate,
          elementId: req.params.mediaId,
          createdAt: new Date(),
        },
      ],
    };

    restMedia.push(newMediaFoundWithReview);

    await writeMedia(restMedia);

    res.send("info sent!");
  } catch (error) {
    next(error);
  }
});

export default mediaRouter;
