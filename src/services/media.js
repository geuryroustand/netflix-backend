import express from "express";
import uniqid from "uniqid";
import { getMedia, writeMedia } from "../ReadAndWriteData/index.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

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

    res.send(medias);
  } catch (error) {
    next(error);
  }
});

mediaRouter.get("/:mediaID", async (req, res, next) => {
  try {
    const medias = await getMedia();

    const mediaFound = medias.find(
      (media) => media.imdbI === req.params.mediaID
    );

    res.send(mediaFound);
  } catch (error) {
    next(error);
  }
});

const id = uniqid();

mediaRouter.post("/", async (req, res, next) => {
  try {
    const medias = await getMedia();

    const newMedia = {
      ...req.body,
      imdbI: id,
      review: {
        _id: uniqid(),
        rate: req.body.review.rate,
        elementId: id,
        comment: req.body.review.comment,
        createdAt: new Date(),
      },
    };

    medias.push(newMedia);

    await writeMedia(medias);

    res.send(medias);
  } catch (error) {
    next(error);
  }
});

mediaRouter.put("/:mediaId", (req, res, next) => {
  try {
    const medias = await getMedia();

    const restMedias = medias.filter((media) => media !== req.params.mediaId);

    if (!restMedias) {
      console.log(`Not found with the ID ${req.params.mediaId}`);
    }

    const upgradetedMedia = {
      ...req.body,
      imdbI: req.params.mediaId,
      upgreadedAt: new Date(),
    };
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
        (media) => media.imdbI !== req.params.mediaId
      );

      const foundMedia = medias.find(
        (media) => media.imdbI === req.params.mediaId
      );

      const newMedia = { ...foundMedia, poster: req.file.path };

      restMedia.push(newMedia);

      await writeMedia(restMedia);

      res.send();

      // await restMedia;
    } catch (error) {
      next(error);
    }
  }
);

export default mediaRouter;
