import mongoose from "mongoose";

// Schema creation for Note model
// Model Based on the schema

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
},
    {timestamps: true} // createdAt and updateAt fields
);

const Note = mongoose.model("Note", noteSchema);

export default Note;