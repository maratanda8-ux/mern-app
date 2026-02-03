export function getAllNotes(res, req) {
    res.status(200).send("You just fetched the notes");
}

export function createNote(res, req) {
    res.status(201).json({message: "Note Created Successfully"});
}

export function updateNote(req,res) {
    res.status(200).json({message: "Note Updated Successfully"});
}

export function deleteNote(req,res) {
    res.status(200).json({message: "Note Deleted Successfully"});
}