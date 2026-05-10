import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              SpeakAI
            </h2>

            <p className="mt-4 text-gray-400 leading-relaxed">
              AI-powered mock interview platform for frontend engineers,
              communication practice, and interview preparation.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white">
              Product
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <Link to="/coach">AI Coach</Link>
              <Link to="/blog">Blogs</Link>
              <Link to="/resources">Resources</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white">
              Company
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-semibold text-white">
              Start Practicing
            </h3>

            <p className="mt-4 text-gray-400">
              Improve communication and crack interviews with AI.
            </p>

            <Link
              to="/coach"
              className="inline-flex mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Start Mock Interview
            </Link>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-white/10 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} SpeakAI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}