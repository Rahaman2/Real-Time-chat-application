import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsers, getMessages, sendMesage } from "../controllers/message.contoller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers );
router.get("/:id", protectRoute, getMessages);
router.post("send/:id", protectRoute, sendMesage)



export default router;