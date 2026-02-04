import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { MdClose, MdCloudUpload } from "react-icons/md";

const ProfileModal = ({ isOpen, onClose }) => {
    const { authUser, setAuthUser } = useAuthContext();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(authUser?.profilePic || "");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const res = await fetch("http://localhost:5001/api/auth/profile", {
                method: "PUT",
                body: formData,
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setAuthUser(data);
                localStorage.setItem("notary-user", JSON.stringify(data));
                toast.success("Profile updated successfully");
                onClose();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-theme-surface border border-theme-border p-6 rounded-xl w-full max-w-sm shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-theme-text-dim hover:text-theme-text">
                    <MdClose size={24} />
                </button>
                <h3 className="text-xl font-bold text-theme-text mb-6">Update Profile Picture</h3>
                
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-6 group cursor-pointer overflow-hidden rounded-full border-2 border-theme-border">
                         <img 
                            src={preview || "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MdCloudUpload className="text-white" size={32} />
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-2 rounded-md bg-theme-text text-theme-bg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={loading || !file}
                    >
                        {loading ? "Uploading..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
