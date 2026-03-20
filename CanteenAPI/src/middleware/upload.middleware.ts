import multer from "multer";
import path from "path";
import fs from "fs";

// const UPLOAD_BASE_PATH =
//   "C:/inetpub/wwwroot/Canteen/CanteenWeb/uploads/menu";
const UPLOAD_BASE_PATH =
  "D:/CIMT-Apps/CanteenModule/Web/uploads/menu";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_BASE_PATH)) {
      fs.mkdirSync(UPLOAD_BASE_PATH, { recursive: true });
    }
    cb(null, UPLOAD_BASE_PATH);
  },

 filename: (req, file, cb) => {
  const menuName = req.body.menuName || "menu";

  const safeMenuName = menuName
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  const ext = path.extname(file.originalname);
  const fileName = `${safeMenuName}${ext}`;

  cb(null, fileName);
},
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

export default upload;