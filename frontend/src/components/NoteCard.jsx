import { MdDelete, MdEdit, MdStar, MdStarBorder } from "react-icons/md";

const NoteCard = ({ note, onDelete, onEdit, onStar }) => {
    return (
        <div className="bg-theme-surface border border-theme-border rounded-lg p-5 hover:border-theme-text-dim transition-colors duration-200 group relative">
            <button 
                onClick={() => onStar(note)} 
                className={`absolute top-4 right-4 transition-colors p-1 ${note.isStarred ? "text-yellow-400" : "text-theme-text-dim hover:text-yellow-400"}`}
                title={note.isStarred ? "Unstar" : "Star"}
            >
                {note.isStarred ? <MdStar size={20} /> : <MdStarBorder size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-theme-text mb-3 truncate pr-8">{note.title}</h2>
            <p className="text-theme-text-dim text-sm leading-relaxed mb-6 line-clamp-4">{note.content}</p>
            <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-theme-border">
                <button onClick={() => onEdit(note)} className="text-theme-text-dim hover:text-theme-text transition-colors p-1" title="Edit">
                    <MdEdit size={18} />
                </button>
                <button onClick={() => onDelete(note._id)} className="text-theme-text-dim hover:text-red-500 transition-colors p-1" title="Delete">
                    <MdDelete size={18} />
                </button>
            </div>
        </div>
    );
};

export default NoteCard;
