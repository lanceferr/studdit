const express = require("express");
const multer = require("multer");
const router = express.Router();
const userController = require("../controllers/userController");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("avatar"), userController.createUser);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.post("/login", userController.loginUser);
router.get("/profile/:username", userController.getUserProfile);

module.exports = router;