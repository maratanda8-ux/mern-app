import Note from '../models/Note.js';

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.log("Error in getAllNotes controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Please provide both title and content" });
        }

        const newNote = new Note({
            userId: req.user._id,
            title,
            content
        });

        if (newNote) {
            await newNote.save();
            res.status(201).json(newNote);
        } else {
            res.status(400).json({ error: "Invalid note data" });
        }

    } catch (error) {
        console.log("Error in createNote controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateNote(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const note = await Note.findOne({ _id: id, userId: req.user._id });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        note.title = title || note.title;
        note.content = content || note.content;

        await note.save();

        res.status(200).json(note);

    } catch (error) {
        console.log("Error in updateNote controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteNote(req, res) {
    try {
        const { id } = req.params;

        const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted successfully" });

    } catch (error) {
        console.log("Error in deleteNote controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
