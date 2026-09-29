const Note = require("../models/Note.js");

async function getAllNotesByUser(req, res) {
    try {
        const notes = await Note.find({ user: req.user._id });
        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not retrieve notes." });
    }
}

async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        const newNote = await Note.create({
            title,
            content,
            user: req.user._id,
        });

        return res.status(201).json(newNote);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function updateNote(req, res) {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found."}); 
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You cannot update this note." });
        }

        if (req.body.title !== undefined) note.title = req.body.title;
        if (req.body.content !== undefined) note.content = req.body.content;
        
        await note.save();
        
        res.status(200).json({ message: "Note updated successfully!", note});
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function deleteNote(req, res) {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) {
            return res.status(404).json({ message: "Note not found." });
        }

        if(note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You cannot delete this note." });
        }

        await note.deleteOne();
        
        return res.json({ message: "Note deleted successfully!", note });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function getOneNote (req, res) {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found." });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You cannot view this note." });
        } 

        return res.status(200).json(note);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllNotesByUser,
    createNote,
    updateNote,
    deleteNote,
    getOneNote,
};