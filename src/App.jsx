import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import FreePrompts from "./pages/FreePrompts.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Services from "./pages/Services.jsx";
import Resources from "./pages/Resources.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Affiliate from "./pages/Affiliate.jsx";
import NotFound from "./pages/NotFound.jsx";
import Coach from "./pages/Coach.jsx";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AuthCallback from "./auth/AuthCallback";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Chat from "./pages/Chat.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/free-prompts" element={<FreePrompts />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/affiliate-disclosure" element={<Affiliate />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protect /coach */}
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <Coach />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <a
          className="fixed right-4 bottom-4 bg-green-500 text-black font-semibold px-4 py-2 rounded-full shadow-soft"
          href="https://wa.me/919110733750"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </AuthProvider>
  );
}
