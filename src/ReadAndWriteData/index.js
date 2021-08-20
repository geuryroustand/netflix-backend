import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON } = fs;

const mediaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/media.json"
);

export const getMedia = () => readJSON(mediaPath);
export const writeMedia = (content) => writeJSON(mediaPath, content);
