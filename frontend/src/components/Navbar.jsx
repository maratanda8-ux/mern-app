import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";
import useLogout from "../hooks/useLogout";
import { MdDarkMode, MdLightMode, MdSettings, MdLogout, MdMenu, MdClose, MdStar } from "react-icons/md";
import ProfileModal from "./ProfileModal";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { authUser } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();
    const { logout } = useLogout();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle Menu"]')) {
                 setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const defaultProfilePic = "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80";

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-theme-bg/80 backdrop-blur-md border-b border-theme-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-bold text-theme-text tracking-tight hover:opacity-90 transition-opacity">
                            Notary
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-theme-surface text-theme-text transition-colors" title={theme === "dark" ? "Light Mode" : "Dark Mode"}>
                            {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
                        </button>

                        {authUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full overflow-hidden border border-theme-border focus:outline-none ring-2 ring-transparent focus:ring-theme-text-dim transition-all"
                                >
                                    <img 
                                        src={authUser.profilePic || defaultProfilePic} 
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
                                        
                                        <Link 
                                            to="/?type=starred"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="w-full text-left px-4 py-2 text-sm text-theme-text hover:bg-theme-bg flex items-center gap-2"
                                        >
                                            <MdStar size={16} className="text-yellow-400" /> Starred Notes
                                        </Link>

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
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-theme-text hover:text-theme-text-dim font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="bg-theme-text text-theme-bg px-4 py-2 rounded-md font-bold hover:opacity-90 transition-opacity">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-theme-surface text-theme-text transition-colors">
                            {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
                        </button>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                            className="text-theme-text hover:text-theme-text-dim transition-colors p-2"
                        >
                            {isMobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="md:hidden bg-theme-bg/95 backdrop-blur-xl border-b border-theme-border shadow-2xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {authUser ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-3 border-b border-theme-border/50 mb-2">
                                     <img 
                                        src={authUser.profilePic || defaultProfilePic} 
                                        alt="Avatar" 
                                        className="w-10 h-10 rounded-full object-cover border border-theme-border"
                                    />
                                     <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-theme-text truncate">{authUser.username}</p>
                                        <p className="text-xs text-theme-text-dim truncate">{authUser.email}</p>
                                     </div>
                                </div>
                                <Link 
                                    to="/?type=starred"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-left px-4 py-3 text-theme-text hover:bg-theme-surface rounded-md flex items-center gap-3 transition-colors"
                                >
                                    <MdStar size={20} className="text-yellow-400" /> Starred Notes
                                </Link>
                                <button 
                                    onClick={() => { setIsProfileModalOpen(true); setIsMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-theme-text hover:bg-theme-surface rounded-md flex items-center gap-3 transition-colors"
                                >
                                    <MdSettings size={20} /> Set Profile Picture
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-theme-surface rounded-md flex items-center gap-3 transition-colors"
                                >
                                    <MdLogout size={20} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-3 rounded-md border border-theme-border text-theme-text font-medium hover:bg-theme-surface transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-3 rounded-md bg-theme-text text-theme-bg font-bold hover:opacity-90 transition-opacity"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </nav>
    );
};

export default Navbar;
