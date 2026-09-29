const express = require("express");
const router = express.Router();
const noteControllers = require("../../controllers/noteControllers.js");
const verifyAuthentication = require("../../utils/auth.js");

router.use(verifyAuthentication);

router.get("/", noteControllers.getAllNotesByUser);
router.post("/", noteControllers.createNote);
router.put("/:id", noteControllers.updateNote);
router.delete("/:id", noteControllers.deleteNote);
router.get("/:id", noteControllers.getOneNote);

module.exports = router;