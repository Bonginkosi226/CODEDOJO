import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "documents",
    resource_type: "auto",
    format: "pdf",
  },
});

const upload = multer({ storage });

export default upload;