export default function Footer() {
  return (
    <footer className="border-t border-border/80 mt-16">
      <div className="container-p py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-muted">
        
        {/* Left column */}
        <div>
          <div className="flex items-center gap-2 font-bold text-text mb-2">
            <img src="/logo.svg" className="w-6 h-6" alt="SpeakAI" /> SpeakAI
          </div>
          <p className="text-sm">
            Interview better with practical AI prompts, tools, and step-by-step guides.
          </p>
        </div>

        {/* Explore column */}
        <div>
          <div className="font-semibold text-text mb-2">Explore</div>
          <div className="grid gap-1 text-sm">
            <a href="/blog">Blog</a>
            <a href="/free-prompts">Free Prompts</a>
            <a href="/services">Services</a>
            <a href="/resources">Resources</a>
          </div>
        </div>

        {/* Legal column */}
        <div>
          <div className="font-semibold text-text mb-2">Legal</div>
          <div className="grid gap-1 text-sm">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/affiliate-disclosure">Affiliate Disclosure</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="container-p py-4 text-xs text-muted flex items-center justify-between">
          <div>© {new Date().getFullYear()} SpeakAI</div>
          <div>Made with ❤️ in India</div>
        </div>
      </div>
    </footer>
  )
}
