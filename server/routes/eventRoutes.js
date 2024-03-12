import express from "express";
import { checkUserAccess } from "../services/authenticationService";
import {
  saveEvent,
  getEvents,
  getEventInfo,
  registerUserToEvent,
  saveFeedback,
  getUserFeedbackForEvent,
  getEventsFeedbacks,
} from "../controllers/eventController";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const updatedFileName = `${uuidv4()}::${file.originalname.replace(
      / /g,
      "_"
    )}`;
    cb(null, updatedFileName);
  },
});

const upload = multer({ storage: storage });

// var upload = multer({ storage: storage })
const router = express.Router();

router.post("/", checkUserAccess, upload.single("file"), saveEvent);
router.post("/list", checkUserAccess, getEvents);
router.get("/:id", checkUserAccess, getEventInfo);
router.post("/register", checkUserAccess, registerUserToEvent);
router.post("/feedback", checkUserAccess, saveFeedback);
router.get(
  "/feedback/:userId/:eventId",
  checkUserAccess,
  getUserFeedbackForEvent
);
router.get("/feedback/:eventId", checkUserAccess, getEventsFeedbacks);

export default router;
