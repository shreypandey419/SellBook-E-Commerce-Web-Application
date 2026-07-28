import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const middlewareDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.join(middlewareDirectory, "..", "uploads", "books");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDirectory),
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const imageFileFilter = (_request, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
    return;
  }

  callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
};

const uploadBookImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadBookImage;
