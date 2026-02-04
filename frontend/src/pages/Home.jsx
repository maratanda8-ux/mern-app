import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { MdAdd } from "react-icons/md";

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: "", content: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [searchParams] = useSearchParams();

    const showStarredOnly = searchParams.get("type") === "starred";

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/notes", {
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setNotes(data);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to fetch data stream");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm deletion of note?")) return;
        try {
            const res = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setNotes(notes.filter((note) => note._id !== id));
                toast.success("Note deleted successfully");
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Error deleting note");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `/api/notes/${currentNote._id}`
                : "/api/notes";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: currentNote.title, content: currentNote.content }),
                credentials: "include"
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(isEditing ? "Data updated" : "New data unit initialized");
                setIsModalOpen(false);
                setCurrentNote({ title: "", content: "" });
                setIsEditing(false);
                fetchNotes(); // Refresh list
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleStarNote = async (note) => {
        try {
            const res = await fetch(`/api/notes/${note._id}/star`, {
                method: "PUT",
                credentials: "include"
            });
            const updatedNote = await res.json();
            if (res.ok) {
                setNotes(prevNotes => prevNotes.map(n => n._id === note._id ? updatedNote : n));
                toast.success(updatedNote.isStarred ? "Note starred" : "Note unstarred");
            } else {
                toast.error(updatedNote.error);
            }
        } catch (error) {
            toast.error("Failed to update star status");
        }
    };

    const openModal = (note = null) => {
        if (note) {
            setIsEditing(true);
            setCurrentNote(note);
        } else {
            setIsEditing(false);
            setCurrentNote({ title: "", content: "" });
        }
        setIsModalOpen(true);
    };

    // Filter notes based on the query parameter
    const filteredNotes = showStarredOnly ? notes.filter(note => note.isStarred) : notes;

    return (
        <div className="min-h-screen bg-theme-bg p-6 pt-24 relative overflow-hidden">
            
            <Navbar />

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl text-theme-text font-semibold">{showStarredOnly ? "Starred Notes" : "Your Notes"}</h2>
                    <button onClick={() => openModal()} className="px-6 py-2 rounded-md bg-theme-text text-theme-bg font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
                        <MdAdd size={20} /> Create Notes
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-bars loading-lg text-theme-text"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.length > 0 ? (
                            [...filteredNotes].sort((a, b) => Number(b.isStarred) - Number(a.isStarred)).map((note) => (
                                <NoteCard key={note._id} note={note} onDelete={handleDelete} onEdit={openModal} onStar={handleStarNote} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 border border-dashed border-theme-border rounded-lg bg-theme-surface/50">
                                <p className="text-theme-text-dim">
                                    {showStarredOnly ? "No starred notes found." : "No notes found. Create one to get started."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-theme-surface border border-theme-border p-8 rounded-xl w-full max-w-lg shadow-2xl relative">
                        <h3 className="text-xl font-bold text-theme-text mb-6">
                            {isEditing ? "Edit Note" : "Create Note"}
                        </h3>
                        <form onSubmit={handleSave}>
                            <div className="mb-5">
                                <label htmlFor="title" className="block text-theme-text-dim mb-2 text-sm font-medium">Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="w-full bg-theme-bg border border-theme-border rounded-md p-3 text-theme-text focus:border-white focus:outline-none transition-colors"
                                    value={currentNote.title}
                                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                    required
                                    placeholder="Enter note title..."
                                />
                            </div>
                            <div className="mb-8">
                                <label htmlFor="content" className="block text-theme-text-dim mb-2 text-sm font-medium">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    className="w-full bg-theme-bg border border-theme-border rounded-md p-3 text-theme-text h-40 focus:border-white focus:outline-none transition-colors resize-none"
                                    value={currentNote.content}
                                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                    required
                                    placeholder="Write your thoughts..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-md text-theme-text-dim hover:text-white hover:bg-theme-bg transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 rounded-md bg-theme-text text-theme-bg font-semibold hover:opacity-90 transition-opacity">
                                    {isEditing ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
