import express from "express";
import {
  getRegisteredEvents,
  getUserList,
} from "../controllers/userController";
import { checkUserAccess } from "../services/authenticationService";

const router = express.Router();

router.post("/userList", checkUserAccess, getUserList);
router.post("/events-list", getRegisteredEvents);

export default router;
