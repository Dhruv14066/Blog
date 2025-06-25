import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory if it doesn't exist
const uploadPath = path.join(process.cwd(), "./public/temp");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  }
});

// Allow only image MIME types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Limit file size to 2MB
const limits = {
  fileSize: 2 * 1024 * 1024
};

// Export configured multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits
});
