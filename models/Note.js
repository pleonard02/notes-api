const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please enter a title."],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Please enter some content for your note."],
    },
}, {
    timestamps: true,
});

const Note = new mongoose.model("Note", notesSchema);

module.exports = Note;