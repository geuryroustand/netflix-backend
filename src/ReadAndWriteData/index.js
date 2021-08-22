import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON } = fs;

const mediaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/media.json"
);

const reviewsPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/reviews.json"
);

export const getMedia = () => readJSON(mediaPath);
export const writeMedia = (content) => writeJSON(mediaPath, content);

export const getReview = () => readJSON(reviewsPath);
export const writeReview = (content) => writeJSON(reviewsPath, content);
