import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";
import useLogout from "../hooks/useLogout";
import { MdDarkMode, MdLightMode, MdSettings, MdLogout } from "react-icons/md";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
    const { authUser } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();
    const { logout } = useLogout();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await logout();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-between items-center mb-8 relative z-50 border-b border-theme-border pb-4">
            <h1 className="text-3xl font-bold text-theme-text tracking-tight">
                Notary
            </h1>
            
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-theme-surface text-theme-text transition-colors" title={theme === "dark" ? "Light Mode" : "Dark Mode"}>
                    {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-10 h-10 rounded-full overflow-hidden border border-theme-border focus:outline-none ring-2 ring-transparent focus:ring-theme-text-dim transition-all"
                    >
                        <img 
                            src={authUser.profilePic || "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80"} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-theme-surface border border-theme-border rounded-lg shadow-xl py-1 z-50">
                            <div className="px-4 py-2 border-b border-theme-border">
                                <p className="text-sm font-bold text-theme-text truncate">{authUser.username}</p>
                                <p className="text-xs text-theme-text-dim truncate">{authUser.email}</p>
                            </div>
                            
                            <button 
                                onClick={() => { setIsProfileModalOpen(true); setIsDropdownOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-theme-text hover:bg-theme-bg flex items-center gap-2"
                            >
                                <MdSettings size={16} /> Set Profile Picture
                            </button>

                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-theme-bg flex items-center gap-2"
                            >
                                <MdLogout size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </div>
    );
};

export default Navbar;
