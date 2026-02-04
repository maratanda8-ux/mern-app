import mongoose from "mongoose";

// Schema creation for Note model
// Model Based on the schema

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isStarred: {
        type: Boolean,
        default: false,
    }
},
    {timestamps: true} // createdAt and updateAt fields
);

const Note = mongoose.model("Note", noteSchema);

export default Note;

