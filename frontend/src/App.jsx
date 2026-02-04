import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Landing />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
      </Routes>
      <footer className="w-full border-t border-theme-border bg-theme-bg/80 backdrop-blur-md text-center py-3 text-sm text-theme-text-dim">
        Created by Aditya<a href="https://www.github.com/maratanda8-ux">(maratanda8-ux)</a> 😤
      </footer>
      <Toaster />
    </div>
  );
}

export default App;
