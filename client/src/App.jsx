import { Routes, Route } from "react-router";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
 
function App() {
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 
        bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]
        bg-[size:14px_24px] 
        z-0" 
      />

      {/* PINK GLOW */}
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] z-0" />

      {/* CYAN GLOW */}
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] z-0" />

      {/* MAIN APP CONTENT */}
      <div className="relative z-10 w-full">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
