import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("notary-user")) || null);
    const [loading, setLoading] = useState(false);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
